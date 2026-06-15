import { useState, useEffect, useMemo } from 'react';
import Header from '../HomePage/Header'; // Σωστό σχετικό μονοπάτι από src/pages προς src/assets/components/HomePage
import GamesFilter from './GamesFilter';
import './GamesPage.css';
import SortBy from './SortBy';
import { useSearchParams } from 'react-router-dom'; // CHANGE: Import useSearchParams
import placeholderImage from '../../images/placeholder.svg';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../../config/api';

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
  // --- FIX: Moved the SortOption type definition inside the component ---
  // This ensures it's always in scope for the state and handler functions.
  type SortOption = "title-A_to_Z" | "title-Z_to_A" | "price-L_to_H" | "price-H_to_L" | "discount";

  const [sortOption, setSortOption] = useState<SortOption>("title-A_to_Z");
  // ADD: State για τα παιχνίδια, το loading και τα errors
  // --- ΣΧΟΛΙΟ React: useState Hooks ---
  // Αυτά τα hooks δημιουργούν state για το component.
  // Το 'games' αποθηκεύει τη λίστα των παιχνιδιών που λαμβάνουμε από το backend.
  // Το 'loading' είναι ένα boolean που δείχνει αν τα δεδομένα φορτώνονται ακόμα.
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);// Αρχικοποιούμε με true για να δείχνουμε "Loading" στην αρχή
  const [error, setError] = useState<string | null>(null);
  // Χρησιμοποιούμε ένα Set για γρήγορη αναζήτηση (O(1) lookup).
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  // State για να κρατάμε τα IDs των παιχνιδιών που κατέχει ο χρήστης
  const [ownedGameIds, setOwnedGameIds] = useState<Set<number>>(new Set());


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
    // 1. Get the 'name' parameter from the URL
    const name = searchParams.get('name');


    // ( new changes) ΔΙΟΡΘΩΣΗ: Το apiUrl πρέπει να είναι σε ΜΙΑ γραμμή χωρίς νέες γραμμές μέσα στο template literal
    // Η νέα γραμμή μπορεί να κάνει το URL άκυρο και να προκαλέσει σφάλμα στο fetch.

    // 2. Add the 'name' parameter to the API URL
    const url = apiUrl(`/api/games?category=${category || ''}&maxPrice=${maxPrice || ''}&free=${free || ''}&discounted=${discounted || ''}&name=${name || ''}`);
    /*για να έχεις πιο λεπτομερή πληροφορία στη σελίδα GamesPage 
    για το ποια κατηγορία έχει επιλεχθεί */
    setLoading(true); // Ξεκινάμε το loading

    fetch(url)
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

  // useEffect για να φέρει το wishlist του χρήστη όταν φορτώνει η σελίδα
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        // Αν δεν υπάρχει token, δεν κάνουμε τίποτα.
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/wishlist'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const wishlistData: Game[] = await response.json();
          // Παίρνουμε τα IDs από τα παιχνίδια και τα βάζουμε στο state.
          const ids = new Set(wishlistData.map(item => item.id));
          setWishlistIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist on page load:", error);
      }
    };

    fetchWishlist();
  }, []); // Το κενό array σημαίνει ότι θα τρέξει μόνο μία φορά, κατά την αρχική φόρτωση.

  // Θα φέρνουμε και το wishlist και τη βιβλιοθήκη μαζί
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        // Παράλληλες κλήσεις για καλύτερη απόδοση
        const [wishlistRes, libraryRes] = await Promise.all([
          fetch(apiUrl('/api/wishlist'), { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(apiUrl('/api/library'), { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (wishlistRes.ok) {
          const wishlistData: Game[] = await wishlistRes.json();
          setWishlistIds(new Set(wishlistData.map(item => item.id)));
        }
        if (libraryRes.ok) {
          const libraryData: Game[] = await libraryRes.json();
          setOwnedGameIds(new Set(libraryData.map(item => item.id)));
        }

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to calculate the discount percentage for a game.
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
      case 'price-L_to_H':
        // Sorts by price, from the lowest to the highest.
        return gamesToSort.sort((a, b) => a.price - b.price);

      case 'price-H_to_L':
        // Sorts by price, from the highest to the lowest.
        return gamesToSort.sort((a, b) => b.price - a.price);

      case 'title-A_to_Z':
        // Sorts by name alphabetically (A-Z), using localeCompare for proper string comparison.
        return gamesToSort.sort((a, b) => a.name.localeCompare(b.name));

      case 'title-Z_to_A':
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

  // A dedicated handler for sort changes ---
  // This function ensures that when the user wants to sort, any specific game search is cleared first.
  const handleSortChange = (newSortOption: SortOption) => {
    // First, update the URL to remove the 'name' parameter.
    // This allows sorting to apply to the broader list of filtered games, not just the single searched one.
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams.toString());
      newParams.delete('name');
      return newParams;
    }, { replace: true });

    // Then, update the local state to apply the new sorting order to the re-fetched list.
    setSortOption(newSortOption);
  };

  // Συνάρτηση για προσθήκη/Αφαιρεση = toggle στο/απο Wishlist
  const handleToggleWishlist = async (game: Game) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    const isWishlisted = wishlistIds.has(game.id);
    const method = isWishlisted ? 'DELETE' : 'POST';

    try {
      const response = await fetch(apiUrl(`/api/wishlist/${game.id}`), {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update wishlist.");
      }

      // Ενημερώνουμε το τοπικό state για άμεση αλλαγή στο UI
      if (isWishlisted) {
        // Αφαίρεση του ID από το Set
        setWishlistIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(game.id);
          return newIds;
        });
      } else {
        // Προσθήκη του ID στο Set
        setWishlistIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.add(game.id);
          return newIds;
        });
      }

    } catch (error: any) {
      console.error("Error updating wishlist:", error);
      alert(error.message);
    }
  };

  // --- NEW: Συνάρτηση για προσθήκη στο Cart ---
  const handleAddToCart = async (gameId: number) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/cart/${gameId}`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add to cart.");
      }

      alert("Game added to your cart!");

    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message);
    }
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
              <SortBy selected={sortOption} onSortChange={handleSortChange} />
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
                {/* We now map over 'sortedGames' instead of the original 'games' array. */}

                {/* Ξεκινάμε με { για να ξεκινήσει το σώμα της συνάρτησης */}
                {sortedGames.map((game) => {

                  // Προσθέτουμε τη λογική που απαιτεί το explicit return
                  const isWishlisted = wishlistIds.has(game.id);
                  // Έλεγχος αν το παιχνίδι είναι αγορασμένο
                  const isOwned = ownedGameIds.has(game.id);

                  // Προσθέτουμε ρητά τη λέξη-κλειδί 'return']
                  return (
                    <div key={game.id} className="col">
                      <div className="game-card card h-100 border-0 text-light bg-dark">
                        <img src={game.imageUrl || placeholderImage} className="card-img-top" alt={game.name} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                        <div className="card-body py-2 px-2 d-flex flex-column">
                          <div className="game-name fw-semibold small text-light mb-1" style={{ fontSize: '1rem' }}>{game.name}</div>

                          {/* PRICE DISPLAY LOGIC */}
                          <div className={`game-meta d-flex align-items-center ${game.originalPrice && game.originalPrice > game.price ? 'justify-content-between' : 'justify-content-end'}`}>

                            {/* This is a ternary operator. It checks if a discount exists. */}
                            {game.originalPrice && game.originalPrice > game.price ? (
                              // IF TRUE (There is a discount), render this complex layout:
                              <>
                                <span className="discount-badge badge p-2">
                                  -{calculateDiscount(game).toFixed(0)}%
                                </span>
                                <div className='price-container'>
                                  <del className="game-price-original">
                                    {game.originalPrice.toFixed(2)} €
                                  </del>
                                  <span className="game-price-final">
                                    {game.price.toFixed(2)} €
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="game-price-final">
                                {game.price === 0 ? 'Free' : `${game.price.toFixed(2)} €`}
                              </span>
                            )}
                          </div>

                          <div className="game-card-actions">
                            {/* Προσθέτουμε τα onClick event --- */}
                            {isOwned ? (
                              // Αν το παιχνίδι είναι αγορασμένο
                              <>
                                <div className="game-card-owned-badge">Owned</div>
                                <Link to="/profile/games" className="game-card-btn btn-view-library">
                                  Go to My Library
                                </Link>
                              </>
                            ) : (
                              // Αν δεν είναι αγορασμένο
                              <>
                                <button className="game-card-btn btn-cart" onClick={() => handleAddToCart(game.id)}>
                                  Add to Cart
                                </button>
                                {isWishlisted ? (
                                  <button className="game-card-btn btn-wishlisted" onClick={() => handleToggleWishlist(game)}>
                                    <FaHeart /> Wishlisted
                                  </button>
                                ) : (
                                  <button className="game-card-btn btn-wishlist" onClick={() => handleToggleWishlist(game)}>
                                    <FaHeart /> Wishlist it
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default GamesPage;
