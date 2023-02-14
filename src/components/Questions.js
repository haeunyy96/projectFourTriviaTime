import { useLocation } from "react-router-dom";
import firebase from './firebase';

const Questions = () => {

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