import React from 'react';
import '../App.css';

interface SearchBarProps {
  filters: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  onFilterChange: (filters: any) => void;
  categories: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFilterChange, categories }) => {
  const handleChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="card">
      <h3 style={{ 
        marginBottom: '20px', 
        color: '#d63384',
        fontSize: '24px',
        fontFamily: "'Fredoka One', cursive",
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🔍 Search & Filter
      </h3>
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔎 Search by name..."
          value={filters.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">🏷️ All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="💰 Min Price"
          value={filters.minPrice}
          onChange={(e) => handleChange('minPrice', e.target.value)}
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="💰 Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          min="0"
          step="0.01"
        />
        <button onClick={clearFilters} className="btn btn-secondary">
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

