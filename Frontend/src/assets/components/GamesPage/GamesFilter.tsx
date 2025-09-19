import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// 1. Εισάγουμε τις κατηγορίες ΑΠΕΥΘΕΙΑΣ εδώ. 
// Αυτό κάνει το component πιο αυτόνομο και ευέλικτο.
const GENRES = ["Action", "RPG", "Strategy", "Adventure", "Simulation", "Racing"];

const GamesFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // --- State management for price slider with debouncing ---
    // Το useState τι είναι και τι κάνει; Είναι ένα React Hook που επιτρέπει σε ένα functional component να έχει state.
    // Επιστρέφει ένα ζευγάρι: την τρέχουσα τιμή του state και μια συνάρτηση για να την ενημερώσει.
    // Το 'localPrice' είναι η τιμή που αλλάζει ΑΜΕΣΑ καθώς ο χρήστης σέρνει το slider.
    const [localPrice, setLocalPrice] = useState(searchParams.get('maxPrice') || '200');
    
    // Αυτο το const: showFree, αρχικοποιείται με την τιμή true ή false ανάλογα με το αν το URL περιέχει το query parameter 
    // 'free' με τιμή 'true'.
    // Αν το URL είναι π.χ. /games?free=true, τότε showFree θα είναι true.
    // Αν το URL δεν έχει το parameter 'free' ή αν έχει οποιαδήποτε άλλη τιμή εκτός από 'true', τότε showFree θα είναι false.
    const [showFree, setShowFree] = useState(searchParams.get('free') === 'true');
    const [showDiscounted, setShowDiscounted] = useState(searchParams.get('discounted') === 'true');
    
    // ADD: Διαβάζουμε τις κατηγορίες ΑΠΕΥΘΕΙΑΣ από το URL. Αυτή είναι πλέον η μοναδική "πηγή αλήθειας".
    const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];

    // --- FIX: Logic is now split into multiple, focused useEffect hooks ---

    // useEffect for Genre changes
    const handleGenreChange = (genre: string, isChecked: boolean) => {
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.delete('name'); // Clear name search on new filter
            const currentGenres = prevParams.get('category')?.split(',').filter(Boolean) || [];
            
            const newGenres = isChecked
                ? [...currentGenres, genre]
                : currentGenres.filter(g => g !== genre);

            if (newGenres.length > 0) {
                newParams.set('category', newGenres.join(','));
            } else {
                newParams.delete('category');
            }
            return newParams;
        }, { replace: true });
    };

    // useEffect for Toggle changes (Free/Discounted)
    useEffect(() => {
        // This effect should only run when the user explicitly clicks the checkboxes.
        // We check against the URL state to avoid running on initial load.
        const freeInUrl = searchParams.get('free') === 'true';
        const discountedInUrl = searchParams.get('discounted') === 'true';

        if (showFree !== freeInUrl || showDiscounted !== discountedInUrl) {
            setSearchParams(prevParams => {
                const newParams = new URLSearchParams(prevParams.toString());
                newParams.delete('name'); // Clear name search on new filter

                if (showFree) newParams.set('free', 'true');
                else newParams.delete('free');

                if (showDiscounted) newParams.set('discounted', 'true');
                else newParams.delete('discounted');
                
                return newParams;
            }, { replace: true });
        }
    }, [showFree, showDiscounted, searchParams, setSearchParams]);

    // --- useEffect for Debouncing the price slider ---
    // Αυτό το useEffect "ακούει" για αλλαγές στην τοπική τιμή (localPrice) του slider.
    useEffect(() => {
        // We compare localPrice with the one in the URL to avoid running on initial load
        if (localPrice !== (searchParams.get('maxPrice') || '200')) {
            const debounceTimer = setTimeout(() => {
                setSearchParams(prevParams => {
                    const newParams = new URLSearchParams(prevParams.toString());
                    newParams.delete('name'); // Clear name search on new filter
                    
                    if (localPrice !== '200') {
                        newParams.set('maxPrice', localPrice);
                    } else {
                        newParams.delete('maxPrice');
                    }
                    return newParams;
                }, { replace: true });
            }, 500); // 500ms καθυστέρηση
    
            return () => clearTimeout(debounceTimer);
        }
    }, [localPrice, searchParams, setSearchParams]);

    return (
        /* Χτίζουμε το panel με utility classes για πλήρη έλεγχο:
        bg-dark: για το σκούρο φόντο.
        text-light: για λευκό κείμενο.
        p-4: για το εσωτερικό padding.
        rounded: για στρογγυλεμένες γωνίες.*/
        <div className="bg-dark text-light border-0 shadow-sm games-filter p-4 rounded">
            
            {/* --- Price Filter Section --- */}
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
                    <div className="d-flex align-items-center gap-2 mt-2">
                        <input type="number" className="form-control form-control-sm bg-dark text-light border-secondary" value="0.00" readOnly />
                        <span className="text-secondary">-</span>
                        <input 
                            type="number" 
                            className="form-control form-control-sm bg-dark text-light border-secondary" 
                            value={parseFloat(localPrice).toFixed(2)}
                            readOnly
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
                    {GENRES.map((genre) => {
                        const checked = selectedCategories.includes(genre);
                        return (
                            <li key={genre} className="mb-2">
                                <label className="form-check d-flex align-items-center gap-2 m-0 cursor-pointer category-line">
                                    <input
                                        type="checkbox"
                                        className="form-check-input m-0"
                                        checked={checked}
                                        onChange={(e) => handleGenreChange(genre, e.target.checked)}
                                    />
                                    <span className="small">
                                        {genre}
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

