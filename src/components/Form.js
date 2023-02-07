import UserChoice from "./UserChoice";

const Form = () => {
    const [userSelection, setUserSelection] = useState(null)

    const handleChange = (event) => {
        setUserSelection(event.target.value);
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
                <input type="submit">Give me photos!</input>
            </form>
            <UserChoice numberOfPlayers={userSelection}/>
        </>
    )
}

export default Form;