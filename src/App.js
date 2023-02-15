import './index.css';
import Header from './components/Header';
import Form from './components/Form';
import Questions from './components/Questions';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Form />} />
                <Route path='/questions' element={<Questions />} />
            </Routes>
        </>
    )
}

export default App;
