import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <header>
            <Link to="/" className='headerLink'>
            <h1>Trivia Time</h1>
            </Link>
        </header>
    )
}

export default Header;