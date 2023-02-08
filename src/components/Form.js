import { useState } from "react";

const Form = () => {    

    const [ numberOfPlayers, setNumberOfPlayers ] = useState('');

    const handlePlayerChange = (event) => {
        setNumberOfPlayers(event.target.value);
    }

    const handleNumberOfPlayersSubmit = (event) => {
        event.preventDefault();

        console.log(event);
    }

    return (
        <section className='playerChoiceForm'>
            <form action="" onSubmit={(event) => handleNumberOfPlayersSubmit(event, numberOfPlayers)}>
                <label htmlFor="filtration">Ready to Play?</label>
                <select id="filtration" defaultValue={'placeholder'} onChange={ handlePlayerChange }>
                    <option value="placeholder" disabled>Select amount of players</option>
                    <option value="1">1 Player</option>
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4">4 Players</option>
                </select>
                <button>Let's Play!</button>
            </form>
        </section>
    )
}

export default Form;