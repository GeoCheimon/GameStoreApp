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
  imageUrl: string;
}

// --- Mock Data (Ψεύτικα Δεδομένα) ---
// --- ΣΧΟΛΙΟ TypeScript: Δήλωση Τύπου Μεταβλητής ---
// Εδώ λέμε: "Η σταθερά 'categories' είναι ένας ΠΙΝΑΚΑΣ ( συμβολίζεται με [] )
// που περιέχει αντικείμενα τύπου 'Category' ".
// Τώρα, αν προσπαθήσεις να φτιάξεις ένα αντικείμενο χωρίς 'name', ο VS Code θα σου βγάλει κόκκινη γραμμή ΑΜΕΣΩΣ.
// --- Mock Data (Ψεύτικα Δεδομένα) ---
const categories: Category[] = [
  { id: 1, name: 'ACTION', imageUrl: 'https://placehold.co/400x500/3498db/ffffff/png?text=Action' },
  { id: 2, name: 'ROLES', imageUrl: 'https://placehold.co/400x500/e74c3c/ffffff/png?text=RPG' },
  { id: 3, name: 'STRATEGY', imageUrl: 'https://placehold.co/400x500/2ecc71/ffffff/png?text=Strategy' },
  { id: 4, name: 'ADVENTURE', imageUrl: 'https://placehold.co/400x500/f1c40f/ffffff/png?text=Adventure' },
  { id: 5, name: 'SIMULATION', imageUrl: 'https://placehold.co/400x500/9b59b6/ffffff/png?text=Simulation' },
  { id: 6, name: 'RACING', imageUrl: 'https://placehold.co/400x500/e67e22/ffffff/png?text=RACING' }
];

// --- Το React Component ---
// --- ΣΧΟΛΙΟ TypeScript: Τύπος Επιστροφής Συνάρτησης ---
// Ακόμα και εδώ, το TypeScript καταλαβαίνει αυτόματα ότι η συνάρτηση επιστρέφει JSX.Element.
// Δεν χρειάζεται να το γράψουμε, αλλά θα μπορούσαμε: const CategoryCarousel = (): JSX.Element => { ... }
const CategoryCarousel = () => {
  // --- ΣΧΟΛΙΟ React Hook: useRef ---
  // Δημιουργούμε ένα "ref" που θα συνδεθεί με το div που περιέχει τις κάρτες.
  // Αυτό μας επιτρέπει να το ελέγχουμε μέσω JavaScript (π.χ. να του πούμε "κάνε scroll").
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Συνάρτηση Χειρισμού του Scroll ---
  // Αυτή η συνάρτηση καλείται όταν πατιέται ένα από τα βελάκια.
  // --- ΑΛΛΑΓΗ: Προσθέσαμε λογική για κυκλική πλοήγηση (loop) ---
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Παίρνουμε τις διαστάσεις του container:
      // scrollLeft: Πόσο έχουμε σκρολάρει από την αρχή.
      // clientWidth: Το ορατό πλάτος του container.
      // scrollWidth: Το συνολικό πλάτος όλου του περιεχομένου (όλες οι κάρτες μαζί).
      const { scrollLeft, clientWidth, scrollWidth } = container;

      const firstCard = container.children[0] as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollAmount = cardWidth + gap;

        if (direction === 'right') {
          // Ελέγχουμε αν είμαστε κοντά στο τέλος.
          // Το `+1` είναι ένα μικρό buffer για τυχόν δεκαδικές τιμές.
          if (scrollLeft + clientWidth + 1 >= scrollWidth) {
            // Αν είμαστε στο τέλος, πήγαινε στην αρχή.
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Αλλιώς, απλά πήγαινε μία θέση δεξιά.
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        } else { // direction === 'left'
          // Ελέγχουμε αν είμαστε στην αρχή.
          if (scrollLeft === 0) {
            // Αν είμαστε στην αρχή, πήγαινε στο τέλος.
            container.scrollTo({ left: scrollWidth, behavior: 'smooth' });
          } else {
            // Αλλιώς, απλά πήγαινε μία θέση αριστερά.
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        }
      }
    }
  };


  return (
    // --- ΣΧΟΛΙΟ Bootstrap: Χρησιμοποιούμε την κλάση 'container' για να κεντράρουμε το section
    // και την κλάση 'py-5' για να προσθέσουμε κάθετο padding (py = padding-top & padding-bottom).
    <section className="container py-5">{/* Το section τυλίγει όλη την 
    κατηγορία. Τι είναι το section; Είναι ένα HTML στοιχείο που χρησιμοποιείται 
    για να ομαδοποιήσει περιεχόμενο. */}
      {/* --- ΣΧΟΛΙΟ Bootstrap: 'text-light' για ανοιχτόχρωμο κείμενο, 'mb-4' για margin-bottom. */}
      <h2 className="text-light mb-4">CATEGORIES</h2>

      {/* --- ΝΕΟ: Wrapper για το Carousel --- */}
      {/* Αυτό το div είναι απαραίτητο για να τοποθετήσουμε σωστά τα βελάκια. */}
      <div className="category-carousel-wrapper">

        {/* --- ΝΕΟ: Κουμπί Αριστερά --- */}
        <button className="carousel-arrow left-arrow" onClick={() => handleScroll('left')}>
          <BsChevronLeft size={24} />
        </button>

        {/* --- ΝΕΑ ΔΟΜΗ: Το "Παράθυρο" (Viewport) --- */}
        {/* Αυτό το div θα έχει σταθερό πλάτος και θα κρύβει ό,τι ξεχειλίζει. */}
        <div className="carousel-viewport">
          {/* 
            --- ΣΧΟΛΙΟ Bootstrap & Custom CSS ---
            'd-flex': Ενεργοποιεί το flexbox για να μπουν οι κάρτες στη σειρά.
            'gap-4': Προσθέτει ένα κενό (gap) ανάμεσα στα flex items (τις κάρτες).
            'category-list': Η δική μας κλάση για τυχόν εξειδικευμένο styling.
            ΣΗΜΕΙΩΣΗ: Προσθέσαμε το 'ref={scrollContainerRef}' για να συνδέσουμε το div με τη λογική μας.
          */}
          <div className="d-flex gap-4 category-list" ref={scrollContainerRef}>        
            
            {/* --- ΣΧΟΛΙΟ TypeScript: Type Inference ---
                Εδώ, το TypeScript είναι έξυπνο. Επειδή ξέρει ότι ο πίνακας 'categories'
                περιέχει αντικείμενα 'Category', καταλαβαίνει αυτόματα (type inference)
                ότι η μεταβλητή 'category' μέσα στο map είναι τύπου 'Category'.
                Έτσι, αν γράψεις category.name (με τυπογραφικό), θα σε διορθώσει αμέσως!
            */}
            {/* Οι αγκύλες σημαίνουν ότι μπαίνει κώδικας JavaScript μέσα στο JSX. */}
            {categories.map((category) => (
              // --- ΣΧΟΛΙΟ Custom CSS & Inline Style ---
              // Εδώ χρησιμοποιούμε τη δική μας κλάση 'category-card' από το CategoryCarousel.css
              // γιατί η εμφάνισή της (background, overlay, hover) είναι πολύ εξειδικευμένη.
              // Το backgroundImage το περνάμε ως inline style γιατί είναι δυναμικό για κάθε κάρτα.
              <div
                key={category.id}
                className="category-card"
                style={{ backgroundImage: `url(${category.imageUrl})` }}
              >
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ΝΕΟ: Κουμπί Δεξιά --- */}
        <button className="carousel-arrow right-arrow" onClick={() => handleScroll('right')}>
          <BsChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default CategoryCarousel;