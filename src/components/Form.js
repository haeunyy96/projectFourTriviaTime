import { useState, useEffect } from "react";
import UserChoice from "./UserChoice";
import { Link, useNavigate } from 'react-router-dom';

const Form = () => {    

    const [ numberOfPlayers, setNumberOfPlayers ] = useState('');
    const [quizCategories, setQuizCategories] = useState([]);
    const [userCategorySelection, setUserCategorySelection] = useState(0);
    const [triviaQuestions, setTriviaQuestions] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const handlePlayerChange = (event) => {
        setNumberOfPlayers(event.target.value);
    }

    const handleNumberOfPlayersSubmit = (event) => {
        event.preventDefault();

        setIsVisible(!isVisible);
    }

    const handleCategoryChange = (event) => {
        setUserCategorySelection(event.target.value)
    }

    const handleCategorySelection = (event) => {
        event.preventDefault();
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
            amount: 12,
            category: userCategorySelection
        })
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setTriviaQuestions(data.results)
            })
    }, [userCategorySelection])

    const navigate = useNavigate()

    const goToQuestions = (e) => {
        e.preventDefault()
        navigate("/questions", { state: triviaQuestions })
    }

    return (
        <section>
            <div className='playerChoiceForm'>
                <form action="" onSubmit={(event) => handleNumberOfPlayersSubmit(event, numberOfPlayers)}>
                    <label htmlFor="filtration">Ready to Play?</label>
                    <select id="filtration" defaultValue={'placeholder'} onChange={ handlePlayerChange }>
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
                                : 'Let\'s play'
                        }
                    </button>
                </form>
                {
                    isVisible
                        ? <UserChoice numOfPlayers={numberOfPlayers} />
                        : null
                }
            </div>
            <div className="categoryChoiceForm">
                <form action="" onSubmit={handleCategorySelection}>
                    <label htmlFor="categoryChoice">Choose a Quiz Category</label>
                    <select id="categoryChoice" defaultValue={'placeholder'} onChange={handleCategoryChange}>
                        <option value="placeholder" disabled>Select Category</option>
                        {
                            quizCategories.map((quizCategory)=>{
                                return <option key={quizCategory.id} value={quizCategory.id}>{quizCategory.name}</option>
                            })
                        }
                    </select>
                    <Link to="/questions" onClick={goToQuestions}>
                        <button>Go to Quiz!</button>
                    </Link>
                </form>
            </div>
        </section>
    )
}

export default Form;