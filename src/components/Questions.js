import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import firebase from './firebase';
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useCountdown } from 'usehooks-ts';

const Questions = () => {
    const navigate = useNavigate();

    const [ player, setPlayer ] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);

        onValue(dbRef, (dbResponse) => {
            const dbValue = dbResponse.val();
            const arrayOfKeys = Object.keys(dbValue);
            const arrayOfUsers = Object.values(dbValue);
            const userArray = [];
            const createUser = () => {
                arrayOfKeys.map((key, index) => {
                    const userObject = {
                        "keyId": key,
                        ...arrayOfUsers[index]
                    }
                    userArray.push(userObject)
                })
                setPlayer(userArray);
            }
            createUser();
        })
        startCountdown();
    }, [])

    const [questionIndex, setQuestionIndex] = useState(0)
    const [playerIndex, setPlayerIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    const location = useLocation();
    const triviaQuestions = location.state.triviaQuestions
    const gameKey = location.state.gameKey
    const timer = location.state.timer
    const numberOfPlayers = location.state.numberOfPlayers
    const numberOfQuestions= location.state.numberOfQuestions

    const splitQuestions = (triviaArray, players) => {
        const questions = [];
        const questionsPerPlayer = (triviaArray.length / players);
        for (let i = 0; i < triviaArray.length; i += questionsPerPlayer) {
            questions.push(triviaArray.slice(i, i + questionsPerPlayer));
        }
        return questions;
    }

    const questions = splitQuestions(triviaQuestions, numberOfPlayers);

    useEffect(() => {
        const database = getDatabase(firebase);
        const dbRef = ref(database, `${gameKey}`);

        onValue(dbRef, (dbRes) => {
            const dbValue = dbRes.val();
            const players = Object.values(dbValue);
            const playerKeys = Object.keys(dbValue);
            const updatedPlayers = players.map((player, index) => ({
                ...player,
                key: playerKeys[index],
                questions: questions[index]
            }));
            const updates = {};
            updatedPlayers.forEach((player) => {
                updates[`/${player.key}`] = player;
            });
            update(dbRef, updates);
        });
    }, []);

    const updateScore = (playerKey) => {
        const database = getDatabase(firebase);
        update(ref(database, `${gameKey}/${playerKey}`), {
            score: score + 1
        });
    }

    const [count, { startCountdown, resetCountdown }] = useCountdown({
        countStart: timer,
        intervalMs: 1000
    })

    useEffect(() => {
        if (count === 0) {
            alert(`You didn't choose an answer!`);
            setQuestionIndex(questionIndex + 1);
            resetCountdown();
            setTimeout(() => startCountdown());
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                resetCountdown();
                startCountdown();
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey, numberOfQuestions: numberOfQuestions }} );
                }
            }
        }
    }, [count])

    const answersArray = []
    let correctAnswer = ''
    let incorrectAnswer = []

    const displayQuestion = () => {
        if (player[playerIndex] !== undefined) {
            return <p>Q. {decodeURIComponent(player[playerIndex].questions[questionIndex].question)}</p>
        }
    }
    
    const shuffleAnswers = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    const addToAnswersArray = () => {
        if (player[playerIndex] !== undefined) {
            correctAnswer = decodeURIComponent(player[playerIndex].questions[questionIndex].correct_answer)
            incorrectAnswer = player[playerIndex].questions[questionIndex].incorrect_answers

            answersArray.push(correctAnswer)
            incorrectAnswer.map((answer) => {
                answersArray.push(decodeURIComponent(answer))
            })
        }
    }

    useEffect(() => {
        setShuffledAnswers(shuffleAnswers(answersArray));
    }, [player, questionIndex]);

    const handleChange = (e) => {
        setUserAnswer(e.target.value)
    }

    const currentPlayer = [];
    if (player[playerIndex] !== undefined) {
        currentPlayer.push(player[playerIndex]);
    }

    const submitAnswer = () => {
        if (userAnswer === ''){
            alert(`You can't submit without choosing an answer...`)
        } else if (userAnswer === correctAnswer) {
            setScore(score + 1);
            setQuestionIndex(questionIndex + 1);
            player[playerIndex].score = score + 1;
            updateScore(player[playerIndex].key);
            setUserAnswer('');
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                setUserAnswer('');
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey, numberOfQuestions: numberOfQuestions } });
                }
            }
        } else if (userAnswer !== correctAnswer){
            alert('Wrong Answer');
            setQuestionIndex(questionIndex + 1);
            setUserAnswer('');
            if (questionIndex === player[playerIndex].questions.length - 1) {
                setQuestionIndex(0);
                setScore(0);
                setPlayerIndex(playerIndex + 1);
                setUserAnswer('');
                if (numberOfPlayers - 1 <= playerIndex) {
                    alert(`Game over`);
                    resetGame();
                    navigate('/leaderboard', { state: { gameKey: gameKey, numberOfQuestions: numberOfQuestions } });
                }
            }
        }
        resetCountdown();
        startCountdown();
        setUserAnswer('');
    }

    const resetGame = () => {
        setQuestionIndex(0);
        setPlayerIndex(0);
        setScore(0);
    }

    return (
        <>
            <div>
                <h4>Time Remaining:</h4>
                <p className="counterTime">{count}</p>
                <p>seconds</p>
            </div>

            <ul className="currentPlayer">
                {
                    currentPlayer.map((player) => {
                        return <li className="playerInfo questionsPlayerInfo" key={player.id}>
                            <div className="avatarContainer questionsAvatarContainer">
                                <img src={player.avatar} alt="player avatar"></img>
                            </div>
                            <div>
                                <h3>{player.playerName}</h3>
                                <p>Your score is: {score}/{numberOfQuestions}</p>
                            </div>
                        </li>
                    })
                }
            </ul>
            <div className="triviaContainer">
                <div className="question">
                    {displayQuestion()}
                </div>
                <div className="answers">
                    <ul>
                    {addToAnswersArray()}
                    {shuffledAnswers.map((answer, index) => {
                        return <li  key={index}>
                            <label htmlFor={answer}>
                            <input type="radio" name="trivia" id="answer" value={answer} checked={userAnswer === answer} onChange={handleChange} />
                            {answer}
                            <br></br>
                            </label>
                            </li>
                    })}
                    <button onClick={submitAnswer}>Submit</button>
                    </ul>
                </div>

            </div>
        </>
    )
}

export default Questions;