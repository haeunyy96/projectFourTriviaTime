import { useState, useEffect } from 'react';
import firebase from './firebase';
import { onValue, ref, getDatabase, remove, push } from 'firebase/database'

const UserChoice = ({ numOfPlayers, gameKey, handlePlayerError }) => {

    const [players, setPlayers] = useState([])
    const [nameInput, setNameInput] = useState('')
    const [disableButton, setDisableButton] = useState(false)
    const [submitCount, setSubmitCount] = useState(numOfPlayers)

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);
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
        //eslint-disable-next-line
    }, [])

    const handleChange = (event) => {
        setNameInput(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);
        const playerInfo = {
                playerName: nameInput,
                avatar: `https://api.dicebear.com/5.x/thumbs/svg?seed=${nameInput}`,
                score: 0,
                questions: ['']
            }
        if (nameInput !== '' && isNaN(nameInput)) {
            push(dbRef, playerInfo);
            setSubmitCount(submitCount - 1);
            if (submitCount <= 1) {
                setDisableButton(true);
            }
        } else {
            alert('Enter a name please!');
        }
        setNameInput("");
    }

    const deletePlayer = (playerId) => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}/${playerId}`);
        remove(dbRef);
        setSubmitCount(submitCount + 1)
        if (submitCount >= 0) {
            setDisableButton(false);
        }
    }

    return (
        <>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="nameInput">Player Name: </label>
                <input type="text" id="nameInput" name="nameInput" onChange={handleChange} value={nameInput} placeholder="Enter your name here." />
                <button required disabled={disableButton} onClick={()=>handlePlayerError(players.length + 1)}>Add Player Name</button>
            </form>
            <p className="remainingPlayers">Remaining # of Players to Add: {submitCount}</p>
            <ul className="listOfPlayers">
                {
                    players.map((player) => {
                        return <li className="playerInfo" key={player.id}>
                            <div className="avatarContainer">
                                <img src={player.playerInfo.avatar} alt="player avatar"></img>
                            </div>
                            <div>
                                <h3>{player.playerInfo.playerName}</h3>
                            </div>
                            <button onClick={() => { deletePlayer(player.id) }}>Delete Player</button>
                        </li>
                    })
                }
            </ul>
        </>
    )
}
export default UserChoice;