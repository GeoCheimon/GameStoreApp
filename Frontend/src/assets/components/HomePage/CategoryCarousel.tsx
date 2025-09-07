// --- Αρχείο γραμμένο σε TypeScript (.tsx) ---
// --- ΣΧΟΛΙΟ React: Εισάγουμε τα hooks και τα εικονίδια που θα χρειαστούμε ---
import { useRef } from 'react'; // useRef για να "πιάσουμε" το div που σκρολάρει.
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; // Εικονίδια για τα βελάκια.
import './CategoryCarousel.css';

// --- ΣΧΟΛΙΟ TypeScript: Ορισμός Τύπου (Interface) ---
// Αυτό το κομμάτι ΔΕΝ υπάρχει στο τελικό αρχείο JavaScript που πάει στον browser.
// Είναι μια οδηγία ΜΟΝΟ για τον editor σου (VS Code) και το TypeScript.
// Λέει: "Δημιουργώ έναν τύπο δεδομένων 'Category'. Οτιδήποτε είναι τύπου 'Category'
// ΠΡΕΠΕΙ να έχει: id (που είναι αριθμός), name (που είναι string), imageUrl (που είναι string)".
interface Category {
  id: number;
  name: string;
}

// --- Mock Data (Ψεύτικα Δεδομένα) ---
// --- ΣΧΟΛΙΟ TypeScript: Δήλωση Τύπου Μεταβλητής ---
// Εδώ λέμε: "Η σταθερά 'categories' είναι ένας ΠΙΝΑΚΑΣ ( συμβολίζεται με [] )
// που περιέχει αντικείμενα τύπου 'Category' ".
// Τώρα, αν προσπαθήσεις να φτιάξεις ένα αντικείμενο χωρίς 'name', ο VS Code θα σου βγάλει κόκκινη γραμμή ΑΜΕΣΩΣ.
// --- Mock Data (Ψεύτικα Δεδομένα) ---
const categories: Category[] = [
  { id: 1, name: 'ACTION' },
  { id: 2, name: 'ROLES' },
  { id: 3, name: 'STRATEGY' },
  { id: 4, name: 'ADVENTURE' },
  { id: 5, name: 'SIMULATION' },
  { id: 6, name: 'RACING' }
];

// --- Το React Component ---
// --- ΣΧΟΛΙΟ TypeScript: Τύπος Επιστροφής Συνάρτησης ---
// Ακόμα και εδώ, το TypeScript καταλαβαίνει αυτόματα ότι η συνάρτηση επιστρέφει JSX.Element.
// Δεν χρειάζεται να το γράψουμε, αλλά θα μπορούσαμε: const CategoryCarousel = (): JSX.Element => { ... }
// --- React Component ---
// Δεν δηλώνουμε ρητά τύπο επιστροφής (TS καταλαβαίνει JSX.Element).
const CategoryCarousel = () => {
  // Ref για το flex container που σκρολάρει οριζόντια.
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- ΝΕΟ: Mapping για display names (δυναμικό) ---
  const displayNameMap: { [key: string]: string } = {
    'ACTION': 'Action',
    'ROLES': 'RPG', 
    'STRATEGY': 'Strategy',
    'ADVENTURE': 'Adventure',
    'SIMULATION': 'Simulation',
    'RACING': 'Racing'
  };

  // Συνάρτηση χειρισμού scroll (με κυκλικό loop).
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, clientWidth, scrollWidth } = container;

    const firstCard = container.children[0] as HTMLElement | null;
    if (!firstCard) return;

    // Υπολογισμός "βήματος": πλάτος κάρτας + gap (από το CSS).
    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(window.getComputedStyle(container).gap) || 0;
    const scrollAmount = cardWidth + gap;

    if (direction === 'right') {
      // Αν είμαστε ουσιαστικά στο τέλος → επέστρεψε αρχή (loop)
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      // Αν είμαστε στην αρχή → πήγαινε στο τέλος (loop).
      if (scrollLeft <= 5) {
        // ΔΙΟΡΘΩΣΗ: Πήγαινε στο τελευταίο scrollable position
        container.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    // Bootstrap: container = κεντράρισμα, py-5 = κάθετο spacing.
    <section className="container py-5">
      <h2 className="text-light mb-4">CATEGORIES</h2>

      {/* Wrapper για να τοποθετήσουμε βελάκια πάνω από το οριζόντιο scroll */}
      <div className="category-carousel-wrapper">
        {/* Κουμπί Αριστερά */}
        <button
          className="carousel-arrow left-arrow"
          onClick={() => handleScroll('left')}
          aria-label="Scroll categories left"
        >
            <BsChevronLeft size={24} />
        </button>

        {/* Viewport: Κρύβει το overflow (οριζόντιο scroll μέσα). */}
        <div className="carousel-viewport">
          {/* Flex container με gap. Το ref συνδέεται για έλεγχο scroll. */}
          <div className="d-flex gap-3 category-list" ref={scrollContainerRef}>
            {categories.map(category => {
              const colorClass = `category-${category.name.toLowerCase()}`;
              // Δυναμικό display name με fallback στο αρχικό όνομα
              const displayName = displayNameMap[category.name] || category.name;
              
              return (
                <div
                  key={category.id}
                  className={`card category-card flex-shrink-0 ${colorClass}`}
                  data-category={category.name}
                >
                  <div className="category-logo">
                    {displayName}
                  </div>
                  {/* Αφαιρέθηκε το category-title */}
                </div>
              );
            })}
          </div>
        </div>

        {/* Κουμπί Δεξιά */}
        <button
          className="carousel-arrow right-arrow"
          onClick={() => handleScroll('right')}
          aria-label="Scroll categories right"
        >
          <BsChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default CategoryCarousel;