import { NavLink } from 'react-router-dom';
import { FaUser, FaGamepad, FaHeart, FaReceipt, FaShoppingCart, FaPlusSquare, FaUsersCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
// Αυτό το component δημιουργεί το μενού πλοήγησης. Χρησιμοποιεί το `NavLink` ώστε το ενεργό link 
// να παίρνει αυτόματα μια ειδική κλάση (`.active`) για να το κάνουμε να ξεχωρίζει οπτικά.

const ProfileSidebar = () => {
  const { user } = useAuth(); // Πάρε τα στοιχεία του χρήστη από το context
  return (
    <div className="profile-sidebar">
      <nav className="nav flex-column">
        {/*
          Χρησιμοποιούμε NavLink αντί για Link γιατί μας δίνει τη δυνατότητα
          να προσθέσουμε μια 'active' class στο link που είναι ενεργό.
        */}
        <div className="sidebar-section">
            <h5 className="sidebar-section-title">ACCOUNT</h5>
            <NavLink to="/profile/details" className="profile-nav-link">
              <FaUser /> Account Settings
            </NavLink>
        </div>
        
        {/* Εμφάνιση των Admin Links ΜΟΝΟ αν ο χρήστης είναι Admin */}
        {user && user.role === 'ROLE_ADMIN' && (
            <div className="sidebar-section">
                <h5 className="sidebar-section-title">ADMIN PANEL</h5>
                <NavLink to="/profile/manage-users" className="profile-nav-link">
                  <FaUsersCog /> Manage Users
                </NavLink>
                <NavLink to="/profile/manage-games" className="profile-nav-link">
                  <FaPlusSquare /> Manage Games
                </NavLink>
            </div>
        )}

        {/* --- ΑΛΛΑΓΗ: Εμφάνιση των User Links ΜΟΝΟ αν ο χρήστης είναι USER --- */}
        {user && user.role === 'ROLE_USER' && (
            <>
                <div className="sidebar-section">
                    <h5 className="sidebar-section-title">LIBRARY</h5>
                    <NavLink to="/profile/games" className="profile-nav-link">
                      <FaGamepad /> My Games
                    </NavLink>
                    <NavLink to="/profile/wishlist" className="profile-nav-link">
                      <FaHeart /> Wishlist
                    </NavLink>
                </div>

                <div className="sidebar-section">
                    <h5 className="sidebar-section-title">PAYMENT</h5>
                    <NavLink to="/profile/transactions" className="profile-nav-link">
                      <FaReceipt /> Transactions
                    </NavLink>
                    <NavLink to="/profile/cart" className="profile-nav-link">
                      <FaShoppingCart /> Cart 
                    </NavLink>
                </div>
            </>
        )}
      </nav>
    </div>
  );
};

export default ProfileSidebar;