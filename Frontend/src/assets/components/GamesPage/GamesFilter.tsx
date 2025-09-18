import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// 1. Εισάγουμε τις κατηγορίες ΑΠΕΥΘΕΙΑΣ εδώ, από το αρχείο του CategoryCarousel.
import { categories, displayNameMap } from '../HomePage/CategoryCarousel';
import './GamesFilter.css';

// Ορίζουμε τον τύπο για τις κατηγορίες για χρήση εντός του component
interface Category {
  id: number;
  name: string;
}

const GamesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- NEW: State management for price filters ---
  // Το useState τι είναι και τι κάνει; Είναι ένα React Hook που επιτρέπει σε ένα functional component να έχει state.
  // Επιστρέφει ένα ζευγάρι: την τρέχουσα τιμή του state και μια συνάρτηση που μπορεί να χρησιμοποιηθεί για να ενημερώσει αυτή την τιμή.
  // Εδώ, αρχικοποιούμε το maxPrice με την τιμή από το URL (αν υπάρχει) ή με '200' ως προεπιλογή.
  // Τα showFree και showDiscounted είναι boolean flags που αρχικοποιούνται με βάση την παρουσία των αντίστοιχων παραμέτρων στο URL.
  // Συγκεκριμενα το καθε const εχει τις εξης λειτουργιες:
  // maxPrice: Αποθηκεύει την τρέχουσα μέγιστη τιμή που έχει επιλέξει ο χρήστης μέσω του slider.
  // showFree: Είναι ένα boolean που δείχνει αν ο χρήστης θέλει να δει μόνο δωρεάν παιχνίδια (true) ή όχι (false).
  
  // --- CHANGE: Debouncing Logic for Price ---
  // 1. Το 'maxPrice' είναι η τιμή που υπάρχει στο URL (η "τελική" τιμή).
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '200');
  // 2. Το 'localPrice' είναι η τιμή που αλλάζει ΑΜΕΣΑ καθώς ο χρήστης σέρνει το slider.
  const [localPrice, setLocalPrice] = useState(maxPrice);
  // --- END OF CHANGE ---

  //Αυτο το const: showFree, αρχικοποιείται με την τιμή true ή false ανάλογα με το αν το URL περιέχει το query parameter 
  // 'free' με τιμή 'true'.
  //Αν το URL είναι π.χ. /games?free=true, τότε showFree θα είναι true.
  //Αν το URL δεν έχει το parameter 'free' ή αν έχει οποιαδήποτε άλλη τιμή εκτός από 'true', τότε showFree θα είναι false.
  const [showFree, setShowFree] = useState(searchParams.get('free') === 'true');
  const [showDiscounted, setShowDiscounted] = useState(searchParams.get('discounted') === 'true');

  // ADD: Διαβάζουμε τις κατηγορίες ΑΠΕΥΘΕΙΑΣ από το URL. Αυτή είναι πλέον η μοναδική "πηγή αλήθειας".
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];

  // ADD: Η νέα συνάρτηση toggle που διαβάζει και γράφει απευθείας στο URL.
  const toggle = (name: string) => {
    setSearchParams(prevParams => {
      // Παίρνουμε τις τρέχουσες κατηγορίες από τα πιο πρόσφατα params
      const currentCategories = prevParams.get('category')?.split(',').filter(Boolean) || [];
      const newCategories = [...currentCategories];
      const index = newCategories.indexOf(name);

      if (index > -1) {
        newCategories.splice(index, 1); // Αφαίρεση
      } else {
        newCategories.push(name); // Προσθήκη
      }

      // Δημιουργούμε ένα νέο αντικείμενο params για να μην αλλάξουμε το προηγούμενο
      const newParams = new URLSearchParams(prevParams.toString());
      if (newCategories.length > 0) {
        newParams.set('category', newCategories.join(','));
      } else {
        newParams.delete('category');
      }
      
      // Επιστρέφουμε τα νέα, ενημερωμένα params
      return newParams;
    }, { replace: true });
  };

  // --- NEW: useEffect for Debouncing ---
  // Αυτό το useEffect "ακούει" για αλλαγές στην τοπική τιμή (localPrice).
  useEffect(() => {
    // Ξεκινάμε ένα χρονόμετρο.
    const debounceTimer = setTimeout(() => {
      // Όταν το χρονόμετρο τελειώσει (μετά από 500ms),
      // ενημερώνουμε την "τελική" τιμή (maxPrice) με την τιμή του slider.
      setMaxPrice(localPrice);
    }, 500); // 500ms καθυστέρηση

    // ΣΗΜΑΝΤΙΚΟ: Αν ο χρήστης ξανακουνήσει το slider πριν περάσουν τα 500ms,
    // αυτή η cleanup συνάρτηση θα ακυρώσει το παλιό χρονόμετρο.
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [localPrice]); // Ενεργοποιείται μόνο όταν αλλάζει το localPrice.
  // --- END OF NEW useEffect ---

  // --- NEW: useEffect to update URL from price filters ---
  useEffect(() => {
    // --- CHANGE: Use the functional update form of setSearchParams ---
    // This ensures we are always working with the LATEST search params
    // and prevents other parameters (like 'category') from being lost.
    setSearchParams(prevParams => {
      // Create a new URLSearchParams object based on the latest params
      const newParams = new URLSearchParams(prevParams.toString());

    

    if (maxPrice !== '200') {
      newParams.set('maxPrice', maxPrice);
    } else {
      newParams.delete('maxPrice');
    }

    if (showFree) {
      newParams.set('free', 'true');
    } else {
      newParams.delete('free');
    }

    if (showDiscounted) {
      newParams.set('discounted', 'true');
    } else {
      newParams.delete('discounted');
    }
    
    // Return the final, updated params
      return newParams;
    }, { replace: true }); // The replace option stays outside

  }, [maxPrice, showFree, showDiscounted, setSearchParams]); // Dependencies remain the same
  // Δηλαδή αυτό εξαρτάται από το debounced maxPrice, άρα είναι σωστό.
  return (
    /* CHANGE: Αφαίρεσα την κλάση 'card' και 'card-body'. 
    Χτίζουμε το panel με utility classes για πλήρη έλεγχο:
    bg-dark: για το σκούρο φόντο.
    text-light: για λευκό κείμενο.
    p-4: για το εσωτερικό padding.
    rounded: για στρογγυλεμένες γωνίες.*/
    <div className="bg-dark text-light border-0 shadow-sm games-filter p-4 rounded">
      
      {/* --- Price Filter Section (Moved to top) --- */}
      <div className="filter-group mb-4 pb-4 border-bottom">
        <h3 className="filter-title h6 fw-semibold mb-3">
          Price
        </h3>
        
        {/* Price Range Slider */}
        <div className="price-range-group mb-3">
            <label htmlFor="priceRange" className="form-label text-secondary small">Price range</label>
            <input 
              type="range" 
              className="form-range" 
              min="0" 
              max="200" 
              step="1" 
              id="priceRange"
              value={localPrice} // Χρησιμοποιούμε την τοπική τιμή για άμεση απόκριση
              onChange={(e) => setLocalPrice(e.target.value)}
            />
            {/* --- NEW: Price Input Boxes --- */}
            <div className="d-flex align-items-center gap-2 mt-2">
                <input type="number" className="form-control form-control-sm bg-dark text-light border-secondary" value="0.00" readOnly />
                <span className="text-secondary">-</span>
                <input 
                  type="number" 
                  className="form-control form-control-sm bg-dark text-light border-secondary" 
                  value={parseFloat(localPrice).toFixed(2)}
                  onChange={(e) => setLocalPrice(e.target.value)}
                />
            </div>
        </div>

        {/* Checkboxes */}
        <div className="form-check mb-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="freeGamesCheck"
              checked={showFree}
              onChange={(e) => setShowFree(e.target.checked)}
            />
            <label className="form-check-label text-light small" htmlFor="freeGamesCheck">
                Free Games
            </label>
        </div>
        <div className="form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="discountedGamesCheck"
              checked={showDiscounted}
              onChange={(e) => setShowDiscounted(e.target.checked)}
            />
            <label className="form-check-label text-light small" htmlFor="discountedGamesCheck">
                Discounted
            </label>
        </div>
      </div>
      {/* --- END OF Price Section --- */}

      {/* --- Genres Filter Section --- */}
      <div className="filter-group">
        <h3 className="filter-title h6 fw-semibold mb-3">
          Genres
        </h3>
        <ul className="list-unstyled mb-0">
          {categories.map((c: Category) => {
            // Η μεταβλητή 'checked' τώρα παίρνει την τιμή της από τη νέα 'selectedCategories' που διαβάζει το URL.
            const checked = selectedCategories.includes(c.name);
            return (
              // CHANGE: Πρόσθεσα ξανά το 'mb-2' για να υπάρχει κενό μεταξύ των γραμμών.
              <li key={c.id} className="mb-2">
                <label className="form-check d-flex align-items-center gap-2 m-0 cursor-pointer category-line">
                  <input
                    type="checkbox"
                    className="form-check-input m-0 mt-0"
                    checked={checked}
                    onChange={() => toggle(c.name)}
                  />
                  <span className="small">
                    {displayNameMap[c.name] || c.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      {/* --- END OF Genres Section --- */}

    </div>
  );
};

export default GamesFilter;