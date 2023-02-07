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

    console.log(triviaQuestions);

    //init state for player name
    const [playerName, setPlayerName] = useState('')

    const playerProfile = {
        'playerName': '',
        'avatar': ''
    }

    //api call to open trivia api
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


// PSUEDO CODE //

// Allow for users to select the amount of players from a drop down sectioon
// Once number of players are selected mount the UserChoice component, so use the selection for the length of an array and map through to generate the player name & input section
// User selects category of questions -> once submitted player names get added to firebase along with the avatar -> category selected gets used within the TriviaApi
// Reroute to Questions.js with the generated info from TriviaApi -> map through state and add questions to component -  setTimeout() function helps with keeping track of the time - if user hits submit button or they dont answer the question in time they're pushed to the next question. 
// Store score in firebase related to the player playing
// When all players have finished playing their games the winner is then present in Leaderboard.js with their name and avatar!!!! 🥳🥳🥳
// If user chooses to restart game user info is deleted from firebase and rerouted to Form.js to play again. 