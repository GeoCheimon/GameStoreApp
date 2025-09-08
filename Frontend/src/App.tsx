import { Routes, Route } from 'react-router-dom';
import HomePage from './assets/components/HomePage/HomePage';
import GamesPage from './assets/components/GamesPage/GamesPage';

function App() {
  console.log('App component loaded!'); // DEBUG
  return (
    <>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamesPage />} />
    </Routes>
    </>
  );
}

export default App;
