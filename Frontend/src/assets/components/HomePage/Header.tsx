import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import NavMenu from './NavMenu';

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
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // useEffect για την αναζήτηση
  useEffect(() => {
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
        setIsSuggestionsVisible(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // useEffect για να κλείνει τα dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setIsNavMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGameSelect = (gameName: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm('');
    navigate(`/games?name=${encodeURIComponent(gameName)}`);
  };

  const handleCategorySelect = (category: string) => {
    setIsSuggestionsVisible(false);
    setSearchTerm('');
    navigate(`/games?category=${encodeURIComponent(category)}`);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.length > 0) {
      handleGameSelect(searchTerm);
    }
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
        
        {/* Search Bar Wrapper - FIX: Removed flex-grow-1 from here */}
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

      {/* 3. Δεξί Μέρος: Πλοήγηηση Χρήστη */}
      <nav className="d-flex align-items-center gap-3">
        <a href="/profile" className="nav-icon" aria-label="User Profile">
          <FaUserCircle size={28} />
        </a>
        <a href="/register" className="nav-button text-decoration-none">REGISTER</a>
        <a href="/signin" className="nav-button text-decoration-none">SIGN IN</a>
      </nav>
    </header>
  );
};

export default Header;