import UserChoice from "./UserChoice";
import { useState } from "react";

const Form = ({formInput, submitHandler}) => {
    const [userSelection, setUserSelection] = useState('')

    const handleChange = (event) => {
        setUserSelection(event.target.value);
        // console.log(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    }
    return (
        <>
            <form action="" onSubmit={(event) => { handleSubmit(event, userSelection) }}>
                <label htmlFor="filtration"></label>
                <select id="filtration" onChange={handleChange} value={userSelection}>
                    <option value="placeholder" disabled>Select amount of players</option>
                    <option value="1">1 player</option>
                    <option value="2">2 players</option>
                    <option value="3">3 players</option>
                    <option value="4">4 players</option>
                    <option value="5">5 players</option>
                    <option value="6">6 players</option>
                </select>
                <input type="submit"/>
            </form>
            <UserChoice numberOfPlayers={userSelection} formInput={formInput} submitHandler={submitHandler}/>
        </>
    )
}

export default Form;