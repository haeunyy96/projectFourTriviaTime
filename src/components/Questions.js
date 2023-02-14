import { useLocation } from "react-router-dom";
import firebase from './firebase'; // linking to keep score and displaying player

// initialize state to house an array of all answers
// initialize state to house the correct answer
// inititalize state to check the users input
// onSubmit check to see if users answer is correct
// intitalize state to house the score

// create object within firebase that holds the game info (per player) -> use that object to push questions & answers from api to then tie this info to the according player  

const Questions = () => {

    useEffect(() => {
        const url = new URL('https://opentdb.com/api.php')
        url.search = new URLSearchParams({
            amount: 3,
            category: 10
        })
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setTriviaQuestions(data)
            })
    }, [])

    const location = useLocation();
    console.log(location)

    return (
        <>
            <p>test! this is where the questions go! </p>
            <ul className="listOfQuestions">
                {
                    location.state.map((question, index) => {
                        return <li key={index}>
                            <p>{decodeURIComponent(question.question)}</p>
                        </li>
                    })
                }
            </ul>
        </>
    )
}

export default Questions;