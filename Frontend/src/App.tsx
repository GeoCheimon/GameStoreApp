import { Routes, Route } from 'react-router-dom';
import HomePage from './assets/components/HomePage/HomePage';
import GamesPage from './assets/components/GamesPage/GamesPage';
import RegisterPage from './assets/components/AuthPages/RegisterPage';
import LoginPage from './assets/components/AuthPages/LoginPage';
import { AuthProvider } from './assets/components/context/AuthContext';
import Wishlist from './assets/components/ProfilePage/Wishlist';

// --- Imports ΜΟΝΟ για το ProfilePage και το AccountDetails ---
import ProfilePage from './assets/components/ProfilePage/ProfilePage';
import AccountDetails from './assets/components/ProfilePage/AccountDetails';
import Cart from './assets/components/ProfilePage/Cart';
import MyGames from './assets/components/ProfilePage/MyGames';
import Transactions from './assets/components/ProfilePage/Transactions';
import ManageUsers from './assets/components/ProfilePage/ManageUsers';
import ManageGames from './assets/components/ProfilePage/ManageGames';

function App() {
  return (
    <>
      {/* Με το AuthProvider λεμε στο App να χρησιμοποιήσει τη νέα "κεντρική μνήμη=Global state=context" */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/games" element={<GamesPage />} />
          {/* NESTED ROUTES ΓΙΑ ΤΗ ΣΕΛΙΔΑ ΠΡΟΦΙΛ */}
          <Route path="/profile" element={<ProfilePage />}>
            {/* Η default υποσελίδα που θα εμφανίζεται στο /profile */}
            <Route index element={<AccountDetails />} />

            {/* Οι υπόλοιπες υποσελίδες */}
            <Route path="details" element={<AccountDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="games" element={<MyGames />} />
            <Route path="transactions" element={<Transactions />} />

            {/* Admin Routes */}
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-games" element={<ManageGames />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
