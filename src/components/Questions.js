import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import firebase from './firebase'; // linking to keep score and displaying player
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";
import { useCountdown } from 'usehooks-ts'

// initialize state to house an array of all answers
// initialize state to house the correct answer
// inititalize state to check the users input
// onSubmit check to see if users answer is correct
// intitalize state to house the score
// create object within firebase that holds the game info (per player) -> use that object to push questions & answers from api to then tie this info to the according player  

const Questions = () => {

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
    // const [correctAnswer, setCorrectAnswer] = useState('');
    // const [incorrectAnswer, setIncorrectAnswer] = useState('');
    // const [answersArray, setAnswersArray] = useState([])
    const [userAnswer, setUserAnswer] = useState('') //state variable for user answer

    const location = useLocation();
    const triviaQuestions = location.state.triviaQuestions //trivia question array from api
    const gameKey = location.state.gameKey
    const timer = location.state.timer

    // Countdown logic
    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: timer,
        intervalMs: 1000
    })
    const [player, setPlayer] = useState([]);

    useEffect(() => {
        if (count === 0) {
            setQuestionIndex(questionIndex + 1);
            resetCountdown();
            startCountdown();
        }
    }, [count])

    const answersArray = [] //empty array to store all answers
    const correctAnswer = decodeURIComponent(triviaQuestions[questionIndex].correct_answer) //variable for correct answer - move to state
    const incorrectAnswer = triviaQuestions[questionIndex].incorrect_answers //variable for incorrect answers array - also move to state?
    const [score, setScore] = useState(0)

    //function to display question with questionIndex variable
    const displayQuestion = () => {
        return <p>Q. {decodeURIComponent(triviaQuestions[questionIndex].question)}</p>
    }
    //function to push correct answer, map through incorrect answer array and push into same array
    const addToAnswersArray = () => {
        answersArray.push(correctAnswer)
        incorrectAnswer.map((answer) => {
            answersArray.push(decodeURIComponent(answer))
        })
    }
    //event handler to save users answer to state
    const handleClick = (e) => {
        setUserAnswer(e.target.value)
    }

    //event handler to check if users answer is right and change index number in displayQuestion function so it will display next question in triviaQuestions array
    // const updateScore = () => {
    //     const dbRef = ref(getDatabase());
    //     onValue(dbRef, (dbResponse) => {
    //         const database = getDatabase(firebase);
    //         const dbValue = dbResponse.val();
    //         const score = Object.values(dbValue)[0].score
    //         console.log(score);
    //         set(dbValue, {
    //             score: score +1
    //         })
    //     })
    // }

    const updateScore = () => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);
        onValue(dbRef, (dbRes) => {
            const dbVal = dbRes.val();
            const currentScore = Object.values(dbVal)[0].score
            // console.log(currentScore)
            setScore(score => score + 1)
            // console.log(score)
            // const addScore = { score }
            // set(currentScore, addScore);
        })
        // set(ref(database, `${gameKey}/`))
    }

    // function updateScore(userId, score) {
    //     const database = getDatabase(firebase);
    //     setScore(score => score + 1)
    //     set(ref(database, `${gameKey}/` + userId), {
    //         score: `${score}`
    //     })
    // }

    const submitAnswer = () => {
        return (userAnswer === correctAnswer)
            ? (setQuestionIndex(questionIndex + 1), resetCountdown(), startCountdown(),updateScore()) //eventually add a function to add points for current player
            : alert('Incorrect. Please try again')
    }
    const currentPlayer = player.slice(0, 1)

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