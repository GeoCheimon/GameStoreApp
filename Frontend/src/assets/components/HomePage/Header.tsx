import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestions>({ games: [], categories: [] });
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const navigate = useNavigate();
  // Το ref συνδέεται στο εξωτερικό div για να διαχειρίζεται τα clicks εκτός της περιοχής αναζήτησης
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // useEffect για να "ακούει" τις αλλαγές στο searchTerm και να φέρνει δεδομένα
  useEffect(() => {
    // Debouncing: Περιμένουμε 300ms πριν κάνουμε το API call για να μην στέλνουμε request σε κάθε πάτημα πλήκτρου
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 1) {
        fetch(`http://localhost:8080/api/games/search?q=${searchTerm}`)
          .then(response => response.json())
          .then(data => {
            setSuggestions(data);
            setIsSuggestionsVisible(true);
          })
          .catch(error => console.error("Error fetching suggestions:", error));
      } else {
        setIsSuggestionsVisible(false); // Κρύβουμε τις προτάσεις αν το κείμενο είναι πολύ μικρό
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // useEffect για να κλείνει το dropdown όταν ο χρήστης κάνει κλικ εκτός του πεδίου αναζήτησης
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Συνάρτηση που εκτελείται όταν ο χρήστης επιλέγει ένα παιχνίδι
  const handleGameSelect = (gameName: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm(''); // Καθαρίζουμε το search bar
    // Πλοήγηση στο GamesPage, περνώντας το όνομα του παιχνιδιού ως παράμετρο στο URL
    navigate(`/games?name=${encodeURIComponent(gameName)}`);
  };

  // Συνάρτηση που εκτελείται όταν ο χρήστης επιλέγει μια κατηγορία
  const handleCategorySelect = (category: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm('');
    navigate(`/games?category=${encodeURIComponent(category)}`);
  };

  // Συνάρτηση που εκτελείται όταν ο χρήστης πατάει Enter στο search bar
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Αποτρέπουμε την ανανέωση της σελίδας
    if (searchTerm.length > 0) {
      handleGameSelect(searchTerm); // Κάνουμε αναζήτηση με ό,τι έχει γράψει ο χρήστης
    }
  };

  return (
    // 'app-header': Η δική μας κλάση για το background-color και το border-bottom.
    // 'd-flex': Ενεργοποιεί το flexbox.
    // 'justify-content-between': Δημιουργεί κενό ανάμεσα στα 3 βασικά παιδιά (logo, search, nav).
    // 'align-items-center': Στοιχίζει κάθετα στο κέντρο όλα τα παιδιά.
    // 'px-4 py-3': Ορίζει padding (px = οριζόντιο, py = κάθετο).
    <header className="app-header d-flex justify-content-between align-items-center px-4 py-3">
      
      {/* --- Λογότυπο --- */}
      {/* 'header-logo': Η δική μας κλάση για το custom χρώμα του κειμένου. */}
      {/* 'text-decoration-none': Κλάση του Bootstrap που αφαιρεί την υπογράμμιση. */}
      {/* 'fw-bold': Κλάση του Bootstrap που κάνει το κείμενο έντονο (font-weight: bold). */}
      <div className="header-logo">
        <a href="/" className="text-decoration-none fw-bold">LootZone</a>
      </div>

      {/* --- Μπάρα Αναζήτησης --- */}
      {/* 'header-search-wrapper': Το εξωτερικό container που πιάνει τον διαθέσιμο χώρο και κεντράρει το περιεχόμενό του. */}
      {/* 'flex-grow-1': Επιτρέπει σε αυτό το div να "απλώσει". */}
      {/* 'mx-4': Προσθέτει οριζόντιο margin. */}
      <div className="header-search-wrapper flex-grow-1 mx-4" ref={searchContainerRef}>
        {/* 'header-search': Το container της φόρμας που έχει το μέγιστο πλάτος και λειτουργεί ως relative parent για το dropdown. */}
        <form className="header-search" onSubmit={handleSearchSubmit}>
          {/* 'form-control': Κλάση του Bootstrap για input πεδία. */}
          {/* 'header-search-input': Η δική μας κλάση για το custom styling. */}
          <input
            type="text"
            className="form-control header-search-input"
            placeholder="Search for games or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 1 && setIsSuggestionsVisible(true)}
          />
          {/* Εμφάνιση του container με τις προτάσεις */}
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

      {/* --- Μενού Πλοήγησης --- */}
      {/* 'd-flex', 'align-items-center': Όπως και πριν, για σωστή στοίχιση. */}
      {/* 'gap-3': Προσθέτει ένα κενό (gap) ανάμεσα στα στοιχεία του nav. */}
      <nav className="d-flex align-items-center gap-3">
        <a href="/profile" className="nav-icon" aria-label="User Profile">
          <FaUserCircle size={28} />
        </a>
        {/* 'nav-button': Κρατάμε τη δική μας κλάση για τα κουμπιά. */}
        <a href="/register" className="nav-button text-decoration-none">REGISTER</a>
        <a href="/signin" className="nav-button text-decoration-none">SIGN IN</a>
      </nav>
    </header>
  );
};

export default Header;