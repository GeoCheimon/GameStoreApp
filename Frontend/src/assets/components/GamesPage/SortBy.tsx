import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import './SortBy.css';

// Defines the available sorting options
type SortOption =
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "discount";

// Maps sort option values to human-readable labels
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Discount: From Highest" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

interface SortByProps {
  onSortChange: (option: SortOption) => void;
  selected: SortOption;
}

const SortBy: React.FC<SortByProps> = ({ onSortChange, selected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Finds the label for the currently selected sort option
  const selectedLabel =
    SORT_OPTIONS.find((opt) => opt.value === selected)?.label || "Sort";

  // Effect to close the dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sortby-container" ref={dropdownRef}>
      {/* The main button that toggles the dropdown */}
      <button
        className="sortby-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          Sort by: <span className="sortby-selected-label">{selectedLabel}</span>
        </span>
        <FaChevronDown className={`sortby-chevron ${open ? 'open' : ''}`} />
      </button>

      {/* The dropdown menu that appears when 'open' is true */}
      {open && (
        <div className="sortby-menu" role="listbox">
          {SORT_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className={`sortby-option ${selected === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onSortChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={selected === opt.value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortBy;
