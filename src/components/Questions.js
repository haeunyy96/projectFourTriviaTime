const Questions = ({arrayOfQuestions}) => {

    // console.log(arrayOfQuestions)

    return (
        <>
        <p>test! this is where the questions go!</p>
            <ul className="listOfQuestions">
                {
                    arrayOfQuestions.map((question, index) => {
                        return <li key={index}>
                            <p>{question.question}</p>
                        </li>
                    })
                }
            </ul>
        </>
    )
}

export default Questions;