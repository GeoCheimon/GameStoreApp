import { useState, useEffect, useMemo } from 'react';
import Header from '../HomePage/Header'; // Σωστό σχετικό μονοπάτι από src/pages προς src/assets/components/HomePage
import GamesFilter from './GamesFilter';
import './GamesPage.css';
import SortBy from './SortBy';
import { useSearchParams } from 'react-router-dom'; // CHANGE: Import useSearchParams
import placeholderImage from '../../images/placeholder.svg';

// ADD: Ορίζουμε τον τύπο για τα δεδομένα του παιχνιδιού
interface Game {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  originalPrice?: number;
}

// --- Το React Component ---
// --- TypeScript: Τύπος Επιστροφής Συνάρτησης ---
// Ακόμα και εδώ, το TypeScript καταλαβαίνει αυτόματα ότι η συνάρτηση επιστρέφει JSX.Element.
// Δεν χρειάζεται να το γράψουμε, αλλά θα μπορούσαμε: const GamesPage = (): JSX.Element => { ... }
// --- React Component ---
// Δεν δηλώνουμε ρητά τύπο επιστροφής (TS καταλαβαίνει JSX.Element).
const GamesPage = () => {
  const [sortOption, setSortOption] = useState<"title-asc" | "title-desc" | "price-asc" | "price-desc" | "discount">("title-asc");
  // ADD: State για τα παιχνίδια, το loading και τα errors
  // --- ΣΧΟΛΙΟ React: useState Hooks ---
  // Αυτά τα hooks δημιουργούν state για το component.
  // Το 'games' αποθηκεύει τη λίστα των παιχνιδιών που λαμβάνουμε από το backend.
  // Το 'loading' είναι ένα boolean που δείχνει αν τα δεδομένα φορτώνονται ακόμα.
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);// Αρχικοποιούμε με true για να δείχνουμε "Loading" στην αρχή
  const [error, setError] = useState<string | null>(null);


  // --- ΣΧΟΛΙΟ React: useSearchParams Hook ---
  // Αυτός ο hook μας δίνει πρόσβαση στις παραμέτρους του URL (π.χ. ?category=ACTION&maxPrice=50).
  // Το 'searchParams' είναι ένα αντικείμενο που μπορούμε να διαβάσουμε ή να αλλάξουμε.
  // Το 'setSearchParams' είναι μια συνάρτηση για να ενημερώσουμε το URL.
  const [searchParams, setSearchParams] = useSearchParams();
  // 1. Παίρνουμε τα επιλεγμένα genres από το URL.
  const selectedGenres = searchParams.get('category')?.split(',').filter(Boolean) || [];

  // ADD: useEffect για να φέρνει δεδομένα όταν αλλάζει η κατηγορία
  // ( new changes) Ενημέρωση του useEffect για να περιλαμβάνει 
  // ΟΛΑ τα φίλτρα (category, maxPrice, free, discounted)
  useEffect(() => {
    // ( new changes) Παίρνουμε όλες τις παραμέτρους από το URL
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    const free = searchParams.get('free');
    const discounted = searchParams.get('discounted');

    // ( new changes) ΔΙΟΡΘΩΣΗ: Το apiUrl πρέπει να είναι σε ΜΙΑ γραμμή χωρίς νέες γραμμές μέσα στο template literal
    // Η νέα γραμμή μπορεί να κάνει το URL άκυρο και να προκαλέσει σφάλμα στο fetch.
    const apiUrl = `http://localhost:8080/api/games?category=${category || ''}&maxPrice=${maxPrice || ''}&free=${free || ''}&discounted=${discounted || ''}`;

    /*για να έχεις πιο λεπτομερή πληροφορία στη σελίδα GamesPage 
    για το ποια κατηγορία έχει επιλεχθεί */
    setLoading(true); // Ξεκινάμε το loading

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);

        setGames(data); // Αποθηκεύουμε τα δεδομένα στο state
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load games.');
      })
      .finally(() => {
        setLoading(false); // Σταματάμε το loading
      });
  }, [searchParams]); // Το useEffect τρέχει κάθε φορά που αλλάζουν τα searchParams
  
  // NEW: Helper function to calculate the discount percentage for a game.
  // This is needed for the 'discount' sort option.
  const calculateDiscount = (game: Game): number => {
    // If there's no original price or the price is not lower, there's no discount.
    if (!game.originalPrice || game.price >= game.originalPrice) {
      return 0;
    }
    // Calculate and return the discount percentage.
    return ((game.originalPrice - game.price) / game.originalPrice) * 100;
  };

  // I use useMemo hook to efficiently sort the games.
  // The sorting logic runs only when the 'games' array or the 'sortOption' changes.
  const sortedGames = useMemo(() => {
    // Create a new array to avoid directly mutating the state.
    const gamesToSort = [...games];

    switch (sortOption) {
      case 'price-asc':
        // Sorts by price, from the lowest to the highest.
        return gamesToSort.sort((a, b) => a.price - b.price);
      
      case 'price-desc':
        // Sorts by price, from the highest to the lowest.
        return gamesToSort.sort((a, b) => b.price - a.price);
      
      case 'title-asc':
        // Sorts by name alphabetically (A-Z), using localeCompare for proper string comparison.
        return gamesToSort.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'title-desc':
        // Sorts by name in reverse alphabetical order (Z-A).
        return gamesToSort.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'discount':
        // Sorts by the calculated discount percentage, from the highest to the lowest.
        return gamesToSort.sort((a, b) => calculateDiscount(b) - calculateDiscount(a));
      
      default:
        // If no sort option matches, return the original (unsorted) array.
        return gamesToSort;
    }
  }, [games, sortOption]); // Dependencies: This code runs only when these values change.
  // 2. Ορίζουμε τη συνάρτηση που αφαιρεί ένα genre.
  // ( new changes) Ενημέρωση της removeGenre για να 
  // χρησιμοποιεί τη functional update μορφή του setSearchParams
  const removeGenre = (genreToRemove: string) => {
    setSearchParams(prevParams => {
      const updatedGenres = selectedGenres.filter(genre => genre !== genreToRemove);
      const newParams = new URLSearchParams(prevParams.toString());

      if (updatedGenres.length > 0) {
        newParams.set('category', updatedGenres.join(','));
      } else {
        newParams.delete('category');
      }

      return newParams;
    }, { replace: true });
  };
  return (
    <>
      <Header />
      {/* container-xl: Responsive container, full-width μέχρι το xl breakpoint (1200px).
          py-4: Κάθετο padding (πάνω-κάτω) μεγέθους 4. */}
      <div className="container-xl py-4">
        {/* row: Δημιουργεί μια σειρά στο grid system.
            g-4: Ορίζει το κενό (gutter) μεταξύ των στηλών σε μέγεθος 4. */}
        <div className="row g-4">
          {/* Sidebar */}
          {/* col-12: Πιάνει 12/12 στήλες (full width) σε μικρές οθόνες.
              col-md-3: Από μεσαίες οθόνες (md) και πάνω, πιάνει 3/12 στήλες. */}
          <aside className="col-12 col-md-3">
            <GamesFilter />
          </aside>

          {/* Main */}
          {/* col-12: Πιάνει 12/12 στήλες σε μικρές οθόνες.
              col-md-9: Από μεσαίες οθόνες (md) και πάνω, πιάνει 9/12 στήλες. */}
          <main className="col-12 col-md-9">
            {/* d-flex: Ενεργοποιεί το Flexbox layout.
                justify-content-between: Στοιχίζει τα στοιχεία στην αρχή και το τέλος, με κενό ανάμεσά τους.
                align-items-center: Κεντράρει τα στοιχεία κάθετα.
                flex-wrap: Επιτρέπει στα στοιχεία να "σπάνε" σε νέα γραμμή αν δεν χωράνε.
                gap-3: Ορίζει το κενό μεταξύ των flex items σε μέγεθος 3.
                mb-4: Προσθέτει κάτω εξωτερικό περιθώριο (margin-bottom) μεγέθους 4. */}
            {/* --- CHANGE: Updated the structure of the header to fix the wrapping issue --- */}
            <div className="games-main-header">
              {/* This new container will hold all the selected filter chips */}
              <div className="filter-chips-container">
                {selectedGenres.map((genre, index) => (
                  <button
                    key={index}
                    type="button"
                    /* btn: Βασικό στυλ κουμπιού.
                       btn-sm: Μικρό μέγεθος κουμπιού.
                       btn-secondary: Γκρι χρώμα (secondary theme color).
                       rounded-pill: Πλήρως στρογγυλεμένες άκρες (σχήμα χαπιού).
                       d-flex, align-items-center: Για σωστή στοίχιση του κειμένου και του 'x'. 
                       Το σύμβολο 'x' ΔΕΝ σχετίζεται με καμία από αυτές τις κλάσεις. 
                       Το 'x' εμφανίζεται από το <span> με το &times; παρακάτω, όχι από κάποια κλάση. */
                    className="btn btn-big btn-secondary rounded-pill d-flex align-items-center"
                    >
                    {genre}
                    <span
                      /* ms-2: Αριστερό περιθώριο (margin-start) μεγέθους 2.
                         badge: Βασικό στυλ για badge.
                         bg-dark: Σκούρο φόντο.
                         text-light: Ανοιχτόχρωμο κείμενο.
                         rounded-circle: Το κάνει τέλειο κύκλο. */
                      className="ms-2 badge bg-dark text-light rounded-circle"
                      style={{ cursor: 'pointer', padding: '3px 6px' }}
                      onClick={() => removeGenre(genre)}
                      aria-label={`Remove ${genre} filter`}
                    >
                      &times;
                    </span>
                  </button>
                ))}
              </div>

              {/* Δεξιά πλευρά: Κουμπί ταξινόμησης
               btn, btn-sm: Βασικό και μικρό στυλ κουμπιού.
                  btn-outline-secondary: Κουμπί με περίγραμμα στο χρώμα secondary.
                  px-3: Οριζόντιο padding (αριστερά-δεξιά) μεγέθους 3.
                  ms-auto: Σπρώχνει το κουμπί τέρμα δεξιά (margin-start: auto). 
              <button className="btn btn-outline-secondary btn-sm px-3 ms-auto">
                Sort: Default
              </button>*/}
              <SortBy selected={sortOption} onSortChange={setSortOption} />
            </div>
            
            {/* ADD: Έλεγχος για loading και error states */}
            {loading && <p className="text-light">Loading games...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* row-cols-2: 2 στήλες ανά σειρά από default.
                row-cols-sm-2: 2 στήλες από small breakpoint και πάνω.
                row-cols-md-3: 3 στήλες από medium breakpoint και πάνω.
                row-cols-lg-4: 4 στήλες από large breakpoint και πάνω.
                g-4: Κενό (gutter) μεγέθους 4 μεταξύ των στηλών. */}
            
            {/* Κάνουμε map πάνω στα πραγματικά δεδομένα από το state */}
            {!loading && !error && (
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {/* CHANGE: We now map over 'sortedGames' instead of the original 'games' array. */}
              {sortedGames.map((game) => (
                <div key={game.id} className="col">
                  <div className="game-card card h-100 border-0 text-light bg-dark">
                    <img src={game.imageUrl || placeholderImage} className="card-img-top" alt={game.name} style={{aspectRatio: '16/9', objectFit: 'cover'}} />
                    <div className="card-body py-2 px-2 d-flex flex-column">
                      <div className="game-name fw-semibold small text-light mb-1" style={{ fontSize: '1rem' }}>{game.name}</div>
                      
                      {/* === START: NEW UPDATED PRICE DISPLAY LOGIC === */}
                        <div className={`game-meta mt-auto d-flex align-items-center ${game.originalPrice && game.originalPrice > game.price ? 'justify-content-between' : 'justify-content-end'}`}>
                          
                          {/* This is a ternary operator. It checks if a discount exists. */}
                          {game.originalPrice && game.originalPrice > game.price ? (
                            // IF TRUE (There is a discount), render this complex layout:
                            <>
                              <span className="discount-badge badge p-2">
                                -{calculateDiscount(game).toFixed(0)}%
                              </span>
                              <div className='price-container'>
                                <del className="game-price-original">
                                  €{game.originalPrice.toFixed(2)}
                                </del>
                                <span className="game-price-final">
                                  €{game.price.toFixed(2)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="game-price-final">
                              {game.price === 0 ? 'Free' : `€${game.price.toFixed(2)}`}
                            </span>
                          )}
                        </div>
                        {/* === END: NEW UPDATED PRICE DISPLAY LOGIC === */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </main> 
        </div>
      </div>
    </>
  );
};

export default GamesPage;