import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import NavMenu from './NavMenu';
import { apiUrl } from '../../../config/api';

// Ορίζουμε τους τύπους για τα δεδομένα που περιμένουμε από το API
interface GameSuggestion {
  id: number;
  name: string;
}

interface Suggestions {
  games: GameSuggestion[];
  categories: string[];
}

const Header = () => {

  const navigate = useNavigate();

  // --- React State Hooks (useState) ---
  // Το useState είναι ένα hook που επιτρέπει στο component να "θυμάται" τιμές.
  // Επιστρέφει την τρέχουσα τιμή και μια συνάρτηση για να την αλλάξουμε.
  
  // State για το κείμενο που πληκτρολογεί ο χρήστης στην αναζήτηση.
  const [searchTerm, setSearchTerm] = useState('');
  // State για τις προτάσεις (games/categories) που έρχονται από το API.
  const [suggestions, setSuggestions] = useState<Suggestions>({ games: [], categories: [] });
  // State για το αν το dropdown της αναζήτησης είναι ορατό ή όχι (true/false).
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  // State για το αν το κύριο μενού πλοήγησης (hamburger menu) είναι ορατό ή όχι.
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  // --- React Ref Hooks (useRef) ---
  // Το useRef είναι ένα hook που μας δίνει μια "αναφορά" (reference) σε ένα στοιχείο του HTML.
  // Το χρησιμοποιούμε για να έχουμε πρόσβαση στο DOM στοιχείο απευθείας, π.χ., για να δούμε αν ο χρήστης έκανε κλικ εκτός αυτού.
  
  // Ref για το container της αναζήτησης.
  const searchContainerRef = useRef<HTMLDivElement>(null);
  // Ref για το container του κύριου μενού πλοήγησης.
  const menuContainerRef = useRef<HTMLDivElement>(null);

  
  // --- React Effect Hooks (useEffect) ---
  // Το useEffect είναι ένα hook που μας επιτρέπει να εκτελούμε "side effects",
  // δηλαδή κώδικα που αλληλεπιδρά με τον "έξω κόσμο" (π.χ., API calls, event listeners).

  // Αυτό το useEffect "ακούει" για αλλαγές στο 'searchTerm'.
  useEffect(() => {
    // Debouncing: Ξεκινάμε ένα χρονόμετρο. Η κλήση στο API θα γίνει μόνο αν ο χρήστης
    // σταματήσει να πληκτρολογεί για 300ms. Αυτό αποτρέπει τις άσκοπες κλήσεις.
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetch(apiUrl(`/api/games/search?q=${searchTerm}`))
          .then(response => response.json())
          .then(data => {
            setSuggestions(data);
            setIsSuggestionsVisible(true);
          })
          .catch(error => console.error("Error fetching suggestions:", error));
      } else {
        setIsSuggestionsVisible(false);
      }
    }, 300);

    // Cleanup function: Αυτή η συνάρτηση εκτελείται όταν το component "καταστρέφεται"
    // ή πριν την επόμενη εκτέλεση του effect. Εδώ, ακυρώνουμε το προηγούμενο χρονόμετρο.
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);// Dependency Array: Το effect θα ξανατρέξει ΜΟΝΟ όταν αλλάξει η τιμή του 'searchTerm'.

  // useEffect για να κλείνει τα dropdowns
  // Αυτό το useEffect διαχειρίζεται το κλείσιμο των dropdowns όταν ο χρήστης κάνει κλικ οπουδήποτε αλλού στη σελίδα.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Έλεγχος για το search dropdown.
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
      // Έλεγχος για το nav menu dropdown.
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setIsNavMenuOpen(false);
      }
    };
    // Προσθέτουμε τον event listener σε ολόκληρο το document.
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup function: Αφαιρούμε τον listener όταν το component καταστρέφεται για να αποφύγουμε memory leaks.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);// Κενό Dependency Array: Αυτό το effect θα τρέξει μόνο μία φορά, όταν το component δημιουργηθεί.

  // Συνάρτηση-χειριστής για την επιλογή ενός παιχνιδιού από τις προτάσεις.
  const handleGameSelect = (gameName: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm('');
    navigate(`/games?name=${encodeURIComponent(gameName)}`);
  };

  // Συνάρτηση-χειριστής για την επιλογή μιας κατηγορίας από τις προτάσεις.
  const handleCategorySelect = (category: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm('');
    navigate(`/games?category=${encodeURIComponent(category)}`);
  };

  // Συνάρτηση-χειριστής για την υποβολή της φόρμας αναζήτησης (πάτημα Enter).
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.length > 0) {
      handleGameSelect(searchTerm);
    }
  };
    const { user, logout } = useAuth(); // <-- 2. Πάρε το 'user' και τη συνάρτηση 'logout'

    const handleLogout = () => {
        logout();
        // Προαιρετικά, κάνε redirect στην αρχική σελίδα
        navigate('/'); 

    };
  
  return (
    <header className="app-header d-flex justify-content-between align-items-center px-4 py-3">
      
      {/* 1. Αριστερό Μέρος: Μόνο το Λογότυπο */}
      <div className="header-logo">
        <a href="/" className="text-decoration-none fw-bold">LootZone</a>
      </div>

      {/* 2. Κεντρικό Μέρος: Μενού Πλοήγησης + Μπάρα Αναζήτησης */}
      <div className="header-center-section flex-grow-1 mx-4">
        {/* Hamburger Menu */}
        <div className="nav-menu-wrapper" ref={menuContainerRef}>
          <button 
            className="nav-menu-button" 
            onClick={() => setIsNavMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            <FaBars size={24} />
          </button>
          {isNavMenuOpen && <NavMenu onClose={() => setIsNavMenuOpen(false)} />}
        </div>

        {/* Search Bar Wrapper */}
        <div className="header-search-wrapper" ref={searchContainerRef}>
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="form-control header-search-input"
              placeholder="Search for games or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setIsSuggestionsVisible(true)}
            />
            {isSuggestionsVisible && (suggestions.games.length > 0 || suggestions.categories.length > 0) && (
              <div className="search-suggestions-container">
                {suggestions.categories.length > 0 && (
                  <div className="suggestion-group">
                    <h6 className="suggestion-title">Categories</h6>
                    {suggestions.categories.map((category) => (
                      <div key={category} className="suggestion-item" onClick={() => handleCategorySelect(category)}>
                        {category}
                      </div>
                    ))}
                  </div>
                )}
                {suggestions.games.length > 0 && (
                  <div className="suggestion-group">
                    <h6 className="suggestion-title">Games</h6>
                    {suggestions.games.map((game) => (
                      <div key={game.id} className="suggestion-item" onClick={() => handleGameSelect(game.name)}>
                        {game.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 3. Δεξί Μέρος: User Profile, Register, Sign In 
      <nav className="d-flex align-items-center gap-3">
        <Link to="/profile" className="nav-icon" aria-label="User Profile">
          <FaUserCircle size={28} />
        </Link>
        <Link to="/register" className="nav-button text-decoration-none">REGISTER</Link>
        <Link to="/signin" className="nav-button text-decoration-none">SIGN IN</Link>
      </nav>*/}
      {/* 3. Δεξί Μέρος: Πλοήγηση Χρήστη (Τώρα είναι δυναμικό!) */}
      <nav className="d-flex align-items-center gap-3">
        {user ? (
          // --- Αν ο χρήστης ΕΙΝΑΙ συνδεδεμένος ---
          <>
            <div className="user-info d-flex align-items-center gap-2">
              <Link to="/profile" className="nav-icon" aria-label="User Profile">
                <FaUserCircle size={28} />
              </Link>
              <span className="username-text text-light fw-bold">{user.username}</span>
            </div>
            <button onClick={handleLogout} className="nav-button-logout">LOG OUT</button>
          </>
        ) : (
          // --- Αν ο χρήστης ΔΕΝ είναι συνδεδεμένος ---
          <>
            <Link to="/profile" className="nav-icon" aria-label="User Profile">
              <FaUserCircle size={28} />
            </Link>
            <Link to="/register" className="nav-button text-decoration-none">REGISTER</Link>
            <Link to="/signin" className="nav-button text-decoration-none">SIGN IN</Link>
          </>
        )}
      </nav>      
    </header>
  );
};
export default Header;
