//import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';
const Header = () => {
  return (
    // --- ΣΧΟΛΙΟ Bootstrap & Custom CSS ---
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
      {/* --- ΣΧΟΛΙΟ Bootstrap --- */}
      {/* 'flex-grow-1': Επιτρέπει σε αυτό το div να "απλώσει" και να πιάσει όλο τον διαθέσιμο χώρο. */}
      {/* 'mx-4': Προσθέτει οριζόντιο margin (αριστερά και δεξιά). */}
      <div className="header-search flex-grow-1 mx-4">
        {/* 'form-control': Η μαγική κλάση του Bootstrap για input πεδία. Τους δίνει σωστό padding, border, κ.λπ. */}
        {/* 'header-search-input': Η δική μας κλάση για το custom background και χρώμα κειμένου. */}
        <input type="text" className="form-control header-search-input" placeholder="Search for games, consoles & more..." />
      </div>

      {/* --- Μενού Πλοήγησης --- */}
      {/* --- ΣΧΟΛΙΟ Bootstrap --- */}
      {/* 'd-flex', 'align-items-center': Όπως και πριν, για σωστή στοίχιση. */}
      {/* 'gap-3': Προσθέτει ένα κενό (gap) ανάμεσα στα στοιχεία του nav. */}
      <nav className="d-flex align-items-center gap-3">
        <a href="/profile" className="nav-icon" aria-label="User Profile">
          <FaUserCircle size={28} />
        </a>
        {/* 'nav-button': Κρατάμε τη δική μας κλάση για τα κουμπιά, γιατί έχουν πολύ custom εμφάνιση. */}
        <a href="/register" className="nav-button text-decoration-none">REGISTER</a>
        <a href="/signin" className="nav-button text-decoration-none">SIGN IN</a>
      </nav>
    </header>
  );
};

export default Header;