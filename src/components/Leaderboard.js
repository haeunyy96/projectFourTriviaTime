import firebase from './firebase';
import { onValue, ref, getDatabase } from 'firebase/database'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const Leaderboard = () => {

    const location = useLocation();
    const gameKey = location.state.gameKey

    const [playersData, setPlayersData] = useState([])

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);
        onValue(dbRef, (dbRes) => {
            const dbValue = dbRes.val();
            const arrayOfPlayers = [];
            for (let propKey in dbValue) {
                arrayOfPlayers.push({
                    playerInfo: dbValue[propKey],
                    id: propKey
                });
            }
            setPlayersData(arrayOfPlayers);
        })
    }, [])


    const arrayOfScores = playersData.map((player) => {
        return (
            player.playerInfo.score
        )
    })

    const highestScore = Math.max(...arrayOfScores)

    const arrayOfWinners = playersData.filter((player) => {
        if (player.playerInfo.score === highestScore) {
            return (
                player
            )
        }
    })

    return (
        <section className="leaderboard">
            <ul className="leaderboardContent">
                {
                    arrayOfWinners.length > 1
                        ? arrayOfWinners.map((player) => {
                            return (
                                <li key={player.id}>
                                    <div><img src={player.playerInfo.avatar} alt={`Trivia winner's avatar`} /></div>
                                    <h4>{player.playerInfo.playerName}</h4>
                                </li>
                            )
                        })
                        : arrayOfWinners.map((player) => {
                            return (
                                <li key={player.id}>
                                    <div><img src={player.playerInfo.avatar} alt={`Trivia winner's avatar`} /></div>
                                    <h4>{player.playerInfo.playerName} is the winner!</h4>
                                </li>
                            )
                        })
                }
                <li>
                    <Link to='/'>
                        <button>Start a New Game!</button>
                    </Link>
                </li>
            </ul>
        </section>
    );
}

export default Leaderboard;