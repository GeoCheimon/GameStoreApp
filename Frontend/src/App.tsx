import { Routes, Route } from 'react-router-dom';
import HomePage from './assets/components/HomePage/HomePage';
import GamesPage from './assets/components/GamesPage/GamesPage';
import RegisterPage from './assets/components/AuthPages/RegisterPage';
import LoginPage from './assets/components/AuthPages/LoginPage';
import { AuthProvider } from './assets/components/context/AuthContext';
function App() {
  return (
    <>
      <AuthProvider> {/* Με το AuthProvider λεμε στο App να χρησιμοποιήσει τη νέα "κεντρική μνήμη=Global state=context*/}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/games" element={<GamesPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
