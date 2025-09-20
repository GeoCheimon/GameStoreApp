import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavMenu.css';

// Οι κατηγορίες που θα εμφανίζονται στο μενού
const GENRES = ["Action", "RPG", "Strategy", "Adventure", "Simulation", "Racing"];

interface NavMenuProps {
  onClose: () => void; // Συνάρτηση για να κλείνει το μενού
}

const NavMenu: React.FC<NavMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();

  // Βοηθητική συνάρτηση που κάνει την πλοήγηση και μετά κλείνει το μενού
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="nav-menu-container">
      <div className="nav-menu-section">
        <div className="nav-menu-item" onClick={() => handleNavigate('/games?sort=new')}>
          New Releases
        </div>
        <div className="nav-menu-item" onClick={() => handleNavigate('/games?discounted=true')}>
          On Sale Now
        </div>
      </div>
      <div className="nav-menu-section">
        {GENRES.map((genre) => (
          <div
            key={genre}
            className="nav-menu-item"
            onClick={() => handleNavigate(`/games?category=${genre}`)}
          >
            {genre}
          </div>
        ))}
      </div>
      <div className="nav-menu-section">
        <div className="nav-menu-item all-games" onClick={() => handleNavigate('/games')}>
          Browse all games
        </div>
      </div>
    </div>
  );
};

export default NavMenu;