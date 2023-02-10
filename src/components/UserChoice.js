import { useState, useEffect } from 'react';
import firebase from './firebase';
import { onValue, ref, getDatabase, remove, push } from 'firebase/database'

const UserChoice = ({ numOfPlayers }) => {

    const [ players, setPlayers ] = useState([]); // initializing state to house an array of players
    const [ nameInput, setNameInput ] = useState(''); // initializing state to keep track of the input section
    const [ disableButton, setDisableButton ] = useState(false); // initializing state to keep track of button status
    const [ submitCount, setSubmitCount ] = useState(numOfPlayers); // initializing state to keep track of how many times player form is submitted

    // side effect that runs on component mount -> any updates to the db will be listened for via firebase onValue module
    // store db and create ref to it
    // use onValue to listen for changes within the db and on page load -> whenever changes occur save the players currently within db in state
    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database);

        onValue(dbRef, (dbRes) => {
            const dbValue = dbRes.val();

            const arrayOfPlayers = [];

            for (let propKey in dbValue) {
                arrayOfPlayers.push({
                    playerInfo: dbValue[propKey],
                    id: propKey
                });
            }

            setPlayers(arrayOfPlayers);
        })
    }, [])

    // function that looks for change within the name input
    const handleChange = (event) => {
        setNameInput(event.target.value);
    }

    // function that handles the submit function of the form -> references to the db and creates an object within db with users name and an avatar to go with it
    const handleSubmit = (event) => {
        event.preventDefault();

        const database = getDatabase(firebase);
        const dbRef = ref(database);

        const playerProfile = {
            playerName: nameInput,
            avatar: `https://api.dicebear.com/5.x/thumbs/svg?seed=${nameInput}`
        }

        if (nameInput !== '' && isNaN(nameInput)) {
            push(dbRef, playerProfile);
            setSubmitCount(submitCount - 1);
            if (submitCount <= 1) {
                setDisableButton(true);
            }
        } else {
            alert('Enter a name please!');
        }

        setNameInput("");
    }

    //function that deletes a player from the game and removes it from firebase
    const deletePlayer = (playerId) => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${playerId}`);
        remove(dbRef);
        setSubmitCount(submitCount + 1)
    }

    return (
        <>
            <form action="" onSubmit= { handleSubmit }>
                <label htmlFor="nameInput">Player Name: </label>
                <input type="text" id="nameInput" name="nameInput" onChange={ handleChange } value={ nameInput } placeholder="Enter your name here."/>
                <button disabled={disableButton}>Add Player Name</button>
            </form>

            <h2>Remaining Players to Add: {submitCount}</h2>

            <ul className="listOfPlayers">
                {
                    players.map((player) => {
                        return <li className="playerInfo" key={player.id}>
                            <div className="avatarContainer">
                                <img src={player.playerInfo.avatar} alt="player avatar"></img>
                            </div>
                            <h3>{player.playerInfo.playerName}</h3>
                            <button onClick={() => { deletePlayer(player.id) }}>Delete Player</button>
                        </li>
                    })
                }
            </ul>
        </>
    )
}

export default UserChoice;