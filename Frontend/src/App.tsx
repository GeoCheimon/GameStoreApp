import { Routes, Route } from 'react-router-dom';
import HomePage from './assets/components/HomePage/HomePage';

// Απλό placeholder μέχρι να προστεθεί το πραγματικό GamesPage component
const GamesPage = () => <div className="container py-5 text-light"><h2>Games Page</h2><p>Coming soon...</p></div>;

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
