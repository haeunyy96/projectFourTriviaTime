import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import firebase from './firebase'; // linking to keep score and displaying player
import { getDatabase, ref, onValue, set, get, update } from "firebase/database";

// initialize state to house an array of all answers
// initialize state to house the correct answer
// inititalize state to check the users input
// onSubmit check to see if users answer is correct
// intitalize state to house the score

// create object within firebase that holds the game info (per player) -> use that object to push questions & answers from api to then tie this info to the according player  

const Questions = () => {

    const [player, setPlayer] = useState([]);

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);

        onValue(dbRef, (dbResponse)=>{
            const dbValue = dbResponse.val();
            const arrayOfKeys = Object.keys(dbValue);
            const arrayOfUsers = Object.values(dbValue);
            const userArray = [];
            const createUser = () => {
                arrayOfKeys.map((key, index)=>{
                    const userObject = {
                        "keyId": key,
                        ... arrayOfUsers[index]
                    }
                    userArray.push(userObject)
                })
                setPlayer(userArray);
            }
            createUser();
        })

    },[])

    const [questionIndex, setQuestionIndex] = useState(0); //state variable for displaying next question in the array
    const [userAnswer, setUserAnswer] = useState('') //state variable for user answer
    const [shuffledAnswers, setShuffledAnswers] = useState([])
    useEffect(() =>{
        setShuffledAnswers(shuffleAnswers(answersArray));
    },[questionIndex])

    // const [correctAnswer, setCorrectAnswer] = useState('');
    // const [incorrectAnswer, setIncorrectAnswer] = useState('');

    const location = useLocation();
    const triviaQuestions = location.state.triviaQuestions //trivia question array from api
    const gameKey = location.state.gameKey


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

    const shuffleAnswers = (array) => {
        for(let i= array.length -1; i >0; i--) {
            let j = Math.floor(Math.random() * (i +1));
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    //event handler to save users answer to state
    const handleClick = (e) => {
        setUserAnswer(e.target.value)
    }
    
    //event handler to check if users answer is right and change index number in displayQuestion function so it will display next question in triviaQuestions array
    const submitAnswer = () => {
        // const updateScore = (score) => {
        //     const db = ref(getDatabase(firebase));
        //     const dbRef = ref(db, `/${score}`);
        //     set(dbRef, {
        //         score:1
        //     })
        //     // onValue(dbRef, (dbResponse) => {
        //     //     const dbValue = dbResponse.val();
        //     //     const score = Object.values(dbValue)[0].score
        //     //     console.log(score);
        //     //     set(dbValue, {
        //     //         score: 1
        //     //     })
        //     // })
        // }
        const updateScore = () => {
            // get(player.score).then((snapshot)=>{
            //     let currentCount = snapshot.val();
            //     currentCount = currentCount + 1;
            //     set(score, currentCount);
            // });
            const database = getDatabase(firebase);
            const dbRef = ref(database);
            console.log(dbRef.key)
//                 onValue(dbRef, (dbResponse) => {
//                     const dbValue = dbResponse.val();
//                     const score = Object.values(dbValue)[0].score
//                     const key = Object.keys(dbValue)[0]

//                     // update(score = score ++)
// ;                    const returnScore = (score) => {
//                         const childRef = ref(database, `/${key}`)
//                         return update(childRef, score +1)
//                     }
// //                     returnScore();
//                 });

        };

        return userAnswer === correctAnswer
            ? (setQuestionIndex(questionIndex + 1),(updateScore())) //eventually add a function to add points for current player
            : alert('Incorrect. Please try again')
    }

    const currentPlayer = player.slice(0,1)

    return (
        <> 
        <ul className="currentPlayer">
            {
                currentPlayer.map((player) => {
                    return <li className="playerInfo" key={player.id}>
                        <div className="avatarContainer">
                            <img src={player.avatar} alt="player avatar"></img>
                        </div>
                        <div>
                            <h3>{player.playerName}</h3>
                            <p>Your score is: {player.score}/3</p>
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
                    {shuffledAnswers.map((answer, index) => {
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