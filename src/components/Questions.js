import { useEffect, useState } from "react";

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

    return (
        <>
        </>
    )
}

export default Questions;