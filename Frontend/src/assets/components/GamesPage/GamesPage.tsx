import Header from '../HomePage/Header'; // Σωστό σχετικό μονοπάτι από src/pages προς src/assets/components/HomePage
import GamesFilter from './GamesFilter';
import './GamesPage.css';
import { useSearchParams } from 'react-router-dom'; // CHANGE: Import useSearchParams

const GamesPage = () => {
  const fakeGames = Array.from({ length: 12 });
  const [searchParams, setSearchParams] = useSearchParams(); // CHANGE: Get search params
  // FIX: Ορίζουμε τις μεταβλητές που έλειπαν.
  // 1. Παίρνουμε τα επιλεγμένα genres από το URL.
  const selectedGenres = searchParams.get('category')?.split(',').filter(Boolean) || [];

  // 2. Ορίζουμε τη συνάρτηση που αφαιρεί ένα genre.
  const removeGenre = (genreToRemove: string) => {
    const updatedGenres = selectedGenres.filter(genre => genre !== genreToRemove);

    if (updatedGenres.length > 0) {
      searchParams.set('category', updatedGenres.join(','));
    } else {
      // Αν δεν μείνει κανένα genre, σβήνουμε την παράμετρο από το URL.
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              {/* Αριστερή πλευρά: Εμφανίζει τα κουμπιά των genres */}
              {/* d-flex, align-items-center, flex-wrap, gap-2: Παρόμοια με παραπάνω, για τα κουμπιά των φίλτρων. */}
              <div className="d-flex align-items-center flex-wrap gap-2">
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

              {/* Δεξιά πλευρά: Κουμπί ταξινόμησης */}
              {/* btn, btn-sm: Βασικό και μικρό στυλ κουμπιού.
                  btn-outline-secondary: Κουμπί με περίγραμμα στο χρώμα secondary.
                  px-3: Οριζόντιο padding (αριστερά-δεξιά) μεγέθους 3.
                  ms-auto: Σπρώχνει το κουμπί τέρμα δεξιά (margin-start: auto). */}
              <button className="btn btn-outline-secondary btn-sm px-3 ms-auto">
                Sort: Default
              </button>
            </div>

            {/* row-cols-2: 2 στήλες ανά σειρά από default.
                row-cols-sm-2: 2 στήλες από small breakpoint και πάνω.
                row-cols-md-3: 3 στήλες από medium breakpoint και πάνω.
                row-cols-lg-4: 4 στήλες από large breakpoint και πάνω.
                g-4: Κενό (gutter) μεγέθους 4 μεταξύ των στηλών. */}
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {fakeGames.map((_, i) => (
                // col: Μία στήλη μέσα στο grid.
                <div key={i} className="col">
                  {/* card: Βασικό στυλ κάρτας.
                      h-100: Ύψος 100% για να γεμίζει τον γονέα (το .col).
                      border-0: Αφαιρεί το περίγραμμα.
                      text-light: Ανοιχτόχρωμο κείμενο για όλη την κάρτα.
                      bg-dark: Σκούρο φόντο. */}
                  <div className="game-card card h-100 border-0 text-light bg-dark">
                    {/* ratio, ratio-16x9: Δημιουργεί ένα πλαίσιο με αναλογία 16:9.
                        rounded: Στρογγυλεμένες γωνίες.
                        mb-2: Κάτω περιθώριο (margin-bottom) μεγέθους 2. */}
                    <div className="thumb-skeleton ratio ratio-16x9 rounded mb-2" />
                    {/* card-body: Το κυρίως περιεχόμενο της κάρτας, με padding.
                        py-2, px-2: Κάθετο και οριζόντιο padding μεγέθους 2.
                        d-flex, flex-column: Flexbox με κάθετη διάταξη. */}
                    <div className="card-body py-2 px-2 d-flex flex-column">
                      {/* fw-semibold: Ημι-έντονη γραμματοσειρά (font-weight).
                          small: Μικρότερο μέγεθος γραμματοσειράς.
                          text-light: Ανοιχτόχρωμο κείμενο.
                          mb-1: Κάτω περιθώριο μεγέθους 1. */}
                      <div className="game-name fw-semibold small text-light mb-1">Game {i + 1}</div>
                      {/* text-secondary: Γκρι χρώμα κειμένου.
                          small: Μικρότερο μέγεθος γραμματοσειράς. */}
                      <div className="game-meta text-secondary small">Price</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default GamesPage;