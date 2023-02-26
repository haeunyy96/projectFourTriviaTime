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


    //find highest scores by creating an array of the scores stored in playersData array and then use Math.max to find the highest score in this array and save it to a variable
    const arrayOfScores = playersData.map((player) => {
        return(
            player.playerInfo.score
        )
    })

    const highestScore = Math.max(...arrayOfScores)

    //sort players in descending order by score
    let sortedScores = playersData.sort(
        (a, b) => (a.playerInfo.score < b.playerInfo.score) ? 1 : (a.playerInfo.score > b.playerInfo.score) ? -1 : 0);
    

    //inside component return, map through sortedScores, if player.playerInfo.score === highestScore, add className='winner' to the li that's returned else add className 'loser'
    return (
        <section className="leaderboard">
            <h2>Leader Board</h2>
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
                                    <h3>Winner!</h3>
                                    <div className="playerNameScore">
                                        <h4>{player.playerInfo.playerName}:</h4>
                                        <h5>{player.playerInfo.score}/3</h5>
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


//LEADERBOARD REFACTOR

//player avatar, name, scores are displayed in descending order of score with the highest scores being labelled "Winner" (apply different styling)

//create a function that defines the sorting order to be used in sort() method on the array of player data

//map through this sorted array to display on the page, giving the higher scores different styling

//if arrayOfWinners includes(player), add this classname and style differently



// const winnerStyling = (arrayOfWinners) => {
//     sortedScores.includes(arrayOfWinners)
//     ? 
//     : ""
// }
