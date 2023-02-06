import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Form from './components/Form';
import Questions from './components/Questions';
import { useState, useEffect } from 'react';
import firebase from './components/firebase';
import { onValue, ref, getDatabase, push } from 'firebase/database'


function App() {

    //init state for trivia questions
    const [triviaQuestions, setTriviaQuestions] = useState('')

    //init state for player name
    const [playerName, setPlayerName] = useState('')

    const playerProfile = {
        'playerName': '',
        'avatar': ''
    }

    //api call to open trivia api
    useEffect(()=> {
        fetch('https://opentdb.com/api.php?amount=10')
            .then(res => res.json())
            .then((response) => {

            setTriviaQuestions(response.results)
        })
    },[])

    //get value of text input for player name and save to state
    const handleChange = (event) => {
        setPlayerName(event.target.value)
    }

    //event handler for submit button to save users name and avatar and push to firebase
    const handleClick = (event) => {
        event.preventDefault();

        playerProfile.playerName = playerName
        playerProfile.avatar = `https://api.dicebear.com/5.x/thumbs/svg?seed=${playerName}`

        const db = getDatabase(firebase);
        const dbRef = ref(db)

        playerName !== ''
        ? push(dbRef, playerProfile)
        : alert('Please enter a name')

        setPlayerName('');
        }

    return (
        <>
        <Form formInput={handleChange} submitHandler={handleClick}/>
        </>
    );
}

export default App;

// just testing upstream
// still testing upstream