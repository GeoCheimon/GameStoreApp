//import { useState, useEffect } from 'react';
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
  // ADD: Διαβάζουμε τις κατηγορίες ΑΠΕΥΘΕΙΑΣ από το URL. Αυτή είναι πλέον η μοναδική "πηγή αλήθειας".
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];

  // REMOVE: Οι παρακάτω 3 ενότητες κώδικα (initialCategory, useState, useEffect)
  // αντικαθίστανται από την απευθείας ανάγνωση του URL παρακάτω.
  /*const initialCategory = searchParams.get('category') || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );

  // Αυτή η λογική θα ενημερώνει το URL και θα φιλτράρει τα παιχνίδια
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    setSearchParams(params);
  }, [selectedCategories, setSearchParams]);
  // REMOVE: Η παλιά συνάρτηση toggle που βασιζόταν στο τοπικό state.
  const toggle = (name: string) => { // Το toggle παίρνει το όνομα της κατηγορίας που αλλάζει κατάσταση (checked/unchecked)
    setSelectedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };*/

  // ADD: Η νέα συνάρτηση toggle που διαβάζει και γράφει απευθείας στο URL.
  const toggle = (name: string) => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(name);

    if (index > -1) {
      updatedCategories.splice(index, 1); // Αφαίρεση
    } else {
      updatedCategories.push(name); // Προσθήκη
    }

    if (updatedCategories.length > 0) {
      searchParams.set('category', updatedCategories.join(','));
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };
  return (
    // CHANGE: Αφαίρεσα την κλάση 'card' και 'card-body'.
    // Χτίζουμε το panel με utility classes για πλήρη έλεγχο:
    // bg-dark: για το σκούρο φόντο.
    // text-light: για λευκό κείμενο.
    // p-4: για το εσωτερικό padding.
    // rounded: για στρογγυλεμένες γωνίες.
    <div className="bg-dark text-light border-0 shadow-sm games-filter p-4 rounded">
      <h3 className="filter-title h6 fw-semibold mb-3 pb-2 border-bottom">
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
  );
};

export default GamesFilter;