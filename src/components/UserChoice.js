import { useState, useEffect } from 'react';
import firebase from './firebase';
import { onValue, ref, getDatabase, remove, push } from 'firebase/database'

const UserChoice = ({ numOfPlayers }) => {

    console.log(numOfPlayers);

    console.log(typeof(numOfPlayers));

    const [players, setPlayers] = useState([]); // initializing state to house an array of players
    const [nameInput, setNameInput] = useState(''); // initializing state to keep track of the input section

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

    const handleChange = (event) => {
        setNameInput(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const database = getDatabase(firebase);
        const dbRef = ref(database);

        const playerProfile = {
            playerName: nameInput,
            avatar: `https://api.dicebear.com/5.x/thumbs/svg?seed=${nameInput}`
        }

        if (nameInput !== '') {
            push(dbRef, playerProfile);
        } else {
            alert('Enter a name please!');
        }

        setNameInput("");
    }

    return (
        <>
            <form action="" onSubmit= { handleSubmit }>
                {[...Array(+numOfPlayers)].map((_, index) => {
                    return (<>
                        <label htmlFor="nameInput">Player Name: </label>
                        <input type="text" id="nameInput" name="nameInput" key={index} onChange={ handleChange } value={nameInput} placeholder="Enter your name here."/>
                        <button>Add Player Name</button>
                    </>
                    )
                })}
            </form>
        </>
    )
}

export default UserChoice;