const UserChoice = ({numberOfPlayers, formInput, submitHandler}) => {
    return (
        <>
            <form action="">
                {[...Array(+numberOfPlayers)].map((_, index) => {
                    return <label htmlFor="playerName">
                        <input type="text" id="playerName" key={index} onChange={formInput}/>
                        </label>
                })}
                <input type="submit" onClick={submitHandler} value="Start Game!" className="submitButton" />
            </form>
        </>
    )
}

export default UserChoice;