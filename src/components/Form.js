import { useState } from "react";
import UserChoice from "./UserChoice";

const Form = () => {    

    const [ numberOfPlayers, setNumberOfPlayers ] = useState('');

    const [isVisible, setIsVisible] = useState(false);

    const handlePlayerChange = (event) => {
        setNumberOfPlayers(event.target.value);
    }

    const handleNumberOfPlayersSubmit = (event) => {
        event.preventDefault();

        setIsVisible(!isVisible);
    }

    return (
        <section className='playerChoiceForm'>
            <form action="" onSubmit={(event) => handleNumberOfPlayersSubmit(event, numberOfPlayers)}>
                <label htmlFor="filtration">Ready to Play?</label>
                <select id="filtration" defaultValue={'placeholder'} onChange={ handlePlayerChange }>
                    <option value="placeholder" disabled>Select amount of players</option>
                    <option value="1">5 Player</option>
                    <option value="2">6 Players</option>
                    <option value="3">7 Players</option>
                    <option value="4">8 Players</option>
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
        </section>

    )
}

export default Form;