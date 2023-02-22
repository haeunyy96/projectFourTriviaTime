import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import firebase from './firebase'; // linking to keep score and displaying player
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";
import { useCountdown } from 'usehooks-ts';

// initialize state to house an array of all answers
// initialize state to house the correct answer
// inititalize state to check the users input
// onSubmit check to see if users answer is correct
// intitalize state to house the score
// create object within firebase that holds the game info (per player) -> use that object to push questions & answers from api to then tie this info to the according player  

const Questions = () => {
    const navigate = useNavigate();

    const [ player, setPlayer ] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);

        onValue(dbRef, (dbResponse) => {
            const dbValue = dbResponse.val();
            const arrayOfKeys = Object.keys(dbValue);
            const arrayOfUsers = Object.values(dbValue);
            const userArray = [];
            const createUser = () => {
                arrayOfKeys.map((key, index) => {
                    const userObject = {
                        "keyId": key,
                        ...arrayOfUsers[index]
                    }
                    userArray.push(userObject)
                })
                setPlayer(userArray);
            }
            createUser();
        })
        startCountdown();
    }, [])

    const [questionIndex, setQuestionIndex] = useState(0); //state variable for displaying next question in the array
    const [playerIndex, setPlayerIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('') //state variable for user answer
    const [shuffledAnswers, setShuffledAnswers] = useState([])

    // passing in props via useLocation function imported from react-router-dom -> info is being passed from Form.js
    const location = useLocation();
    const triviaQuestions = location.state.triviaQuestions //trivia question array from api
    const gameKey = location.state.gameKey
    const timer = location.state.timer
    const numberOfPlayers = location.state.numberOfPlayers

    // logic for shuffling answers
    useEffect(() => {
        setShuffledAnswers(shuffleAnswers(answersArray));
    }, [questionIndex])

    // create a function to split the questions up between the players in the session -> define two paramaters triviaArray which will be passed in as triviaQuestions & players which will be passed in as numberOfPLayers
    const splitQuestions = (triviaArray, players) => {
        // create an array to house the slice'd arrays to be able to distribute to players later on
        const questions = [];
        // calculating how many questions should be given to each player
        const questionsPerPlayer = (triviaArray.length / players);
        // loop through triviaArray & push the slice'd array items to questions array
        for (let i = 0; i < triviaArray.length; i += questionsPerPlayer) {
            questions.push(triviaArray.slice(i, i + questionsPerPlayer));
        }
        // return questions to be used outside of function
        return questions;
    }

    // saving splitQuestion function results to a variable to be reused in a useEffect to store the questions to the players in firebase
    const questions = splitQuestions(triviaQuestions, numberOfPlayers);

    // useEffect being used to run the effect only when the component first mounts -> fetches firebase db and updates players questions based on the questions results stored from the function above
    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);

        onValue(dbRef, (dbRes) => {
            const dbValue = dbRes.val();
            // create an array of player objects from db
            const players = Object.values(dbValue);
            // create an array of player keys from db
            const playerKeys = Object.keys(dbValue);
            // creates a new array -> ...player copies all the properties from the OG player obj to the new object -> the lines of code that follow add new properties within the copied obj based on the index of the .map function. 
            const updatedPlayers = players.map((player, index) => ({
                ...player,
                key: playerKeys[index],
                questions: questions[index]
            }));
            // create an empty object to house the updates for each player's data in firebase db
            const updates = {};
            // loop through the array created above and for each player we're adding a new property to the updates object using bracket notation to take advantage of template literals -> the property name is the players key from firebase db, and the value held within the key is the entire player obj itself
            updatedPlayers.forEach((player) => {
                updates[`/${player.key}`] = player;
            });
            // once update is called with the arguments dbRef (reference to the game obj in firebase db) and updates (the object created on line 91) the according unique key is matched to the according player in firebase db and is updated with the according questions
            update(dbRef, updates);
        });
    }, []);

    const updateScore = (playerKey) => {
        const database = getDatabase(firebase);
        update(ref(database, `${gameKey}/${playerKey}`), {
            score: score
        });
    }

    if (player[playerIndex] !== undefined) {
        updateScore(player[playerIndex].key);
    }

    // Countdown logic
    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: timer,
        intervalMs: 1000
    })

    useEffect(() => {
        if (count === 0) {
            alert(`You didn't choose an answer!`);
            setQuestionIndex(questionIndex + 1);
            resetCountdown();
            setTimeout(() => startCountdown());
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                resetCountdown();
                startCountdown();
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey}} );
                }
            }
        }
    }, [count])

    const answersArray = [] //empty array to store all answers
    let correctAnswer = ''; //variable for correct answer
    let incorrectAnswer = []; //variable for incorrect answers array 


    //function to display question with questionIndex variable
    const displayQuestion = () => {
        if (player[playerIndex] !== undefined) {
            return <p>Q. {decodeURIComponent(player[playerIndex].questions[questionIndex].question)}</p>
        }
    }
    
    //function to push correct answer, map through incorrect answer array and push into same array
    const addToAnswersArray = () => {
        if (player[playerIndex] !== undefined) {
            correctAnswer = decodeURIComponent(player[playerIndex].questions[questionIndex].correct_answer)
            incorrectAnswer = player[playerIndex].questions[questionIndex].incorrect_answers

            answersArray.push(correctAnswer)

            incorrectAnswer.map((answer) => {
                answersArray.push(decodeURIComponent(answer))
            })
        }
    }

    const shuffleAnswers = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    //event handler to save users answer to state
    const handleClick = (e) => {
        setUserAnswer(e.target.value)
    }

    let currentPlayer = [];
    if (player[playerIndex] !== undefined) {
        currentPlayer.push(player[playerIndex]);
    }

    const submitAnswer = () => {
        resetCountdown();
        startCountdown();

        if (userAnswer === correctAnswer) {
            setScore(score + 1);
            setQuestionIndex(questionIndex + 1);
            player[playerIndex].score = score + 1;
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey } });
                }
            }
        } else if (userAnswer !== correctAnswer){
            alert('Wrong Answer');
            setQuestionIndex(questionIndex + 1);
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey } });
                }
            }
        }
    }

    const resetGame = () => {
        setQuestionIndex(0);
        setPlayerIndex(0);
        setScore(0);
    }

    console.log(player)

    return (
        <>
            <div>
                <h4>Time Remaining:</h4>
                <p className="counterTime">{count}</p>
                <p>seconds</p>
            </div>

            <ul className="currentPlayer">
                {
                    currentPlayer.map((player) => {
                        return <li className="playerInfo" key={player.id}>
                            <div className="avatarContainer">
                                <img src={player.avatar} alt="player avatar"></img>
                            </div>
                            <div>
                                <h3>{player.playerName}</h3>
                                <p>Your score is: {score}/3</p>
                            </div>
                        </li>
                    })
                }
            </ul>
            <div className="triviaContainer">
                <div className="question">
                    {displayQuestion()}
                </div>
                <div className="answers">
                    {addToAnswersArray()}
                    {answersArray.map((answer, index) => {
                        return <label htmlFor={answer} key={index}>
                            <input type="radio" name="trivia" id="answer" value={answer} onClick={handleClick} />
                            {answer}
                            <br></br>
                        </label>
                    })}
                    <button onClick={submitAnswer}>Submit</button>
                </div>

            </div>
        </>
    )
}

export default Questions;