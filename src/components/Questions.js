import { useLocation } from "react-router-dom";
import { useState } from "react";
import firebase from './firebase'; // linking to keep score and displaying player

// initialize state to house an array of all answers
// initialize state to house the correct answer
// inititalize state to check the users input
// onSubmit check to see if users answer is correct
// intitalize state to house the score

// create object within firebase that holds the game info (per player) -> use that object to push questions & answers from api to then tie this info to the according player  

const Questions = () => {

    const [questionIndex, setQuestionIndex] = useState(0); //state variable for displaying next question in the array
    // const [correctAnswer, setCorrectAnswer] = useState('');
    // const [incorrectAnswer, setIncorrectAnswer] = useState('');
    // const [answersArray, setAnswersArray] = useState([])
    const [userAnswer, setUserAnswer] = useState('') //state variable for user answer

    const location = useLocation();
    const triviaQuestions = location.state //trivia question array from api

    const answersArray = [] //empty array to store all answers
    const correctAnswer = decodeURIComponent(triviaQuestions[questionIndex].correct_answer) //variable for correct answer - move to state
    const incorrectAnswer = triviaQuestions[questionIndex].incorrect_answers //variable for incorrect answers array - also move to state?
    
    //function to display question with questionIndex variable
    const displayQuestion = ( )=> {
        return <p>{decodeURIComponent(triviaQuestions[questionIndex].question)}</p>
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
    const submitAnswer = () => {
        return userAnswer === correctAnswer
        ? setQuestionIndex(questionIndex + 1) //eventually add a function to add points for current player
        : alert('Incorrect. Please try again')
    }

    return (
        <>
            {displayQuestion()}
            {addToAnswersArray()}
            
            {answersArray.map((answer, index) => {
                return <label htmlFor={answer} key={index}>{answer}<input type="radio" name="trivia" id="answer" value={answer} onClick={handleClick} /></label>
            })}
            <button onClick={submitAnswer}>Submit</button>
        </>
    )
}

export default Questions;