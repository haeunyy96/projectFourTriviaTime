import { useState, useEffect } from "react";
import UserChoice from "./UserChoice";
import { Link, useNavigate } from 'react-router-dom';
import firebase from './firebase';
import { ref, getDatabase, remove, push, get } from 'firebase/database'

const Form = () => {

    const [numberOfPlayers, setNumberOfPlayers] = useState(''); // initailizing state to house how many players are playing
    const [numberOfQuestions, setNumberOfQuestions] = useState(3)
    const [quizCategories, setQuizCategories] = useState([]); // initialized state to hold the list of categories from the api
    const [userCategorySelection, setUserCategorySelection] = useState(0); // initialized state to hold the user choice for user choice which is identified by a number returned from the api
    const [triviaQuestions, setTriviaQuestions] = useState([]); // initialized state to hold returned trivia questions including choices + correct answer --> use this to go through choices to push to an array
    const [gameKey, setGameKey] = useState(''); // init state to hold game session key
    const [isVisible, setIsVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [showInstruction, setShowInstruction] = useState(true);
    const [disableButton, setDisableButton] = useState(false); // initializing state to keep track of button status
    const [playerErrorCheck, setPlayerErrorCheck] = useState('')
    const [errorMessages, setErrorMessages] = useState('')
    const [timer, setTimer] = useState(30)
    const errors = {
        players: 'Please enter the amount of players and enter your name',
        categories: 'Please select a category',
        questions: 'Please enter the number of questions you would like (between 3 and 12)'
    }

    const handlePlayerChange = (event) => { // function for seeing player change 
        setNumberOfPlayers(event.target.value);
    }
    const handleNumberOfPlayersSubmit = (event) => { // function to check if visibilty of userChoice component
        event.preventDefault();
        setIsVisible(!isVisible);
    }
    const handleCategoryChange = (event) => { // function for checking the cateogry of which the player has chosen
        setUserCategorySelection(event.target.value)
    }
    const handleNumberOfQuestions = (event) => {
        setNumberOfQuestions(event.target.value)
    }

    //api call to populate drop down options for categories in for
    useEffect(() => {
        const url = new URL('https://opentdb.com/api_category.php')
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setQuizCategories(data.trivia_categories);
            })
    }, [])

    //api call to fetch quiz question data based on user category selection
    useEffect(() => {
        const url = new URL('https://opentdb.com/api.php')
        url.search = new URLSearchParams({
            amount: numberOfPlayers * numberOfQuestions,
            category: userCategorySelection,
            encode: 'url3986'
        })
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setTriviaQuestions(data.results)
            })
    }, [userCategorySelection])

    //trivia questions get saved to state and then passed down - I feel like we should shuffle them here...
    //
    const navigate = useNavigate()

    const goToQuestions = (e) => { // function to reroute to questions component while also passing state via navigate
        e.preventDefault()
        if (numberOfPlayers === playerErrorCheck && userCategorySelection !== 0){
            navigate("/questions", { state: { triviaQuestions: triviaQuestions, gameKey: gameKey, timer: timer, numberOfPlayers: numberOfPlayers, numberOfQuestions: numberOfQuestions } })
        } else if (numberOfPlayers === '' || playerErrorCheck !== numberOfPlayers) {
            setErrorMessages('players')
        } else if (userCategorySelection === 0){
            setErrorMessages('categories')
        }
    }

    const gameSession = (e) => {
        e.preventDefault()
        const database = getDatabase(firebase);
        const dbRef = ref(database);
        const gameId = ''
        const playerObject = push(dbRef, gameId)
        setGameKey(playerObject.key);
        // use playerObject.key.[player1, player2, player etc..] to add player info to the game session object in firebase
        setShow(!show);
        setShowInstruction(!showInstruction);
        setDisableButton(true);
        return playerObject;
    }

    const handleTimerChange = (event) => {
        setTimer(event.target.value)
    }

    const deleteAllGames = () => {
        const database = getDatabase(firebase);
        const dbRef = ref(database);
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const gameObject = snapshot.val()
                for (const game in gameObject) {
                    const gameRef = ref(database, game)
                    remove(gameRef)
                }
            }
        })
    }

    const handlePlayerError = (num) => {
        setPlayerErrorCheck(`${num}`)
    }

    const errorMessage = (selection)=> {
        if (selection === 'players'){
            return <p className="error">{errors.players}</p>
        } else if (selection === 'categories'){
            return <p className="error">{errors.categories}</p>
        } else if (selection === 'questions'){
            return <p className="error">{errors.questions}</p>
        }
    };
    return (
        <section>
            {
                showInstruction
                ?
                <>
                <ul className="formDiv">
                    <li className="instructionTitle">How to play:</li>
                    <li className="instructionList">1. Choose the <strong>number of players 👥</strong> and <strong>add your names!</strong></li>
                    <li className="instructionList">2. Choose a <strong>quiz category</strong> and select the <strong>level of difficulty 😬</strong></li>
                    <li className="instructionList">3. Each person will get <strong>3 questions</strong> based on the chosen category</li>
                    <li className="instructionList">4. The <strong>timer</strong> will run for <strong>15, 30 or 60 seconds</strong> based on the chosen level of difficulty</li>
                    <li className="instructionList">5. At the end of the game, the <strong>🏆 WINNER 🏆</strong> will be announced!</li>
                    <li className="instructionList">6. CLICK BELOW TO PLAY!!!</li>
                </ul>
                <button className="startButton" onClick={gameSession} disabled={disableButton}>CLICK TO START!</button>
                </>
                :null
            }

            {
                show
                    ? 
                        <div className="formDiv">
                        <div className="formContainer">
                            <div className='playerChoiceForm'>
                                <form action="" onSubmit={(event) => handleNumberOfPlayersSubmit(event, numberOfPlayers)}>
                                    <label htmlFor="filtration">Choose a Number of Players:</label>
                                    <select id="filtration" defaultValue={'placeholder'} onChange={handlePlayerChange}>
                                        <option value="placeholder" disabled>Select amount of players</option>
                                        <option value="1">1 Player</option>
                                        <option value="2">2 Players</option>
                                        <option value="3">3 Players</option>
                                        <option value="4">4 Players</option>
                                    </select>
                                    <button>
                                        {
                                            isVisible
                                                ? 'Nevermind'
                                                : 'Submit'
                                        }
                                    </button>
                                </form>
                                {
                                    isVisible
                                        ? <UserChoice numOfPlayers={numberOfPlayers} gameKey={gameKey} handlePlayerError={handlePlayerError} />
                                        : null
                                }
                            </div>
                            <div className="verticalLine"></div>
                            <div className="horizontalLine"></div>
                            <div className="categoryChoiceForm">
                                <form action="">
                                    <label htmlFor="categoryChoice">Choose a Quiz Category</label>
                                    <select required id="categoryChoice" defaultValue={'placeholder'} onChange={handleCategoryChange}>
                                        <option value="placeholder" disabled>Select Category</option>
                                        {
                                            quizCategories.map((quizCategory) => {
                                                return <option key={quizCategory.id} value={quizCategory.id}>{quizCategory.name}</option>
                                            })
                                        }
                                    </select>
                                    <label htmlFor="quantity">Choose number of questions per player</label>
                                    <select id="quantity" name="quantity" defaultValue={"placeholder"}  onChange={handleNumberOfQuestions}>
                                        <option value="placeholder" disabled>Select number</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </form>
                                <form action="">
                                    <label htmlFor="timerChoice">Choose the Level of Difficulty</label>
                                    <select required id="timerChoice" defaultValue={'placeholder'} onChange={handleTimerChange}>
                                        <option value="placeholder" disabled>Select time</option>
                                        <option value="60">Easy (60 seconds)</option>
                                        <option value="30">Moderate (30 seconds)</option>
                                        <option value="15">Hard (15 seconds)</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        <div className="linkErrorContainer">
                            <Link to="/questions">
                                <button className="goToQuizButton" onClick={goToQuestions}>Go to Quiz!</button>
                            </Link>
                            {errorMessage(errorMessages)}
                        </div>
                            <button onClick={()=> deleteAllGames()}>Delete All Games</button>
                        </div>
                    : null
            }
        </section>
    )
}
export default Form;