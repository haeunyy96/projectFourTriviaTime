import UserChoice from "./UserChoice";

const Form = ({formInput, submitHandler}) => {
    return (
        <form action="">
            <label htmlFor="playerName">
                <input type="text" id="playerName" onChange={formInput} />
            </label>

            <input type="submit" onClick={submitHandler} value="Start Game!" className="submitButton" />
        </form>
    )
}

export default Form;