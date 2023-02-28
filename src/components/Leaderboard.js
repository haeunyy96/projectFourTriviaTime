import firebase from './firebase';
import { onValue, ref, getDatabase } from 'firebase/database'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const Leaderboard = () => {

    const location = useLocation();
    const gameKey = location.state.gameKey
    const numberOfQuestions = location.state.numberOfQuestions
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
        return(
            player.playerInfo.score
        )
    })

    const highestScore = Math.max(...arrayOfScores)

    let sortedScores = playersData.sort(
        (a, b) => (a.playerInfo.score < b.playerInfo.score) ? 1 : (a.playerInfo.score > b.playerInfo.score) ? -1 : 0);
    
        return (
        <section className="leaderboard">
            <h2>🏆 Leaderboard 🏆</h2>
            <ul className="leaderboardContent">
                {
                    sortedScores.map((player) => {
                        if (player.playerInfo.score === highestScore){
                        return (
                           <li key={player.id} className="winner">
                                <div className="playerScoreAvatar">
                                    <img src={player.playerInfo.avatar} alt={`Trivia winner's avatar`} />
                                </div>
                                <div className="playerScoreInfo">
                                    <h3>WINNER!</h3>
                                    <div className="playerNameScore">
                                        <h4>{player.playerInfo.playerName}:</h4>
                                        <h5>{player.playerInfo.score}/{numberOfQuestions}</h5>
                                    </div>
                                </div>
                            </li>
                        )} else {
                            return (
                                <li key={player.id} className="loser">
                                    <div className="playerScoreAvatar">
                                        <img src={player.playerInfo.avatar} alt={`Trivia winner's avatar`} />
                                    </div>
                                    <div className="playerScoreInfo">
                                        <h3>Better luck next time!</h3>
                                        <div className="playerNameScore">
                                            <h4>{player.playerInfo.playerName}:</h4>
                                            <h5>{player.playerInfo.score}/3</h5>
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    })
                }
            </ul>
            <Link to='/'>
                <button className="newGameButton">Start a New Game!</button>
            </Link>
        </section>
    );
}

export default Leaderboard;