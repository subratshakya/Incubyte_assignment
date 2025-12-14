import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetService, Sweet } from '../services/api';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import SearchBar from '../components/SearchBar';
import '../App.css';

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sweets, searchFilters]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAllSweets();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: any = {};
      if (searchFilters.name) filters.name = searchFilters.name;
      if (searchFilters.category) filters.category = searchFilters.category;
      if (searchFilters.minPrice) filters.minPrice = parseFloat(searchFilters.minPrice);
      if (searchFilters.maxPrice) filters.maxPrice = parseFloat(searchFilters.maxPrice);

      if (Object.keys(filters).length > 0) {
        const data = await sweetService.searchSweets(filters);
        setFilteredSweets(data);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    }
  };

  const handlePurchase = async (id: number, quantity: number) => {
    try {
      await sweetService.purchaseSweet(id, quantity);
      await loadSweets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Purchase failed');
    }
  };

  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowModal(true);
  };

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const handleDeleteSweet = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await sweetService.deleteSweet(id);
      await loadSweets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRestock = async (id: number, quantity: number) => {
    try {
      await sweetService.restockSweet(id, quantity);
      await loadSweets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restock failed');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSweet(null);
    loadSweets();
  };

  const categories = Array.from(new Set(sweets.map(s => s.category)));

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>
            <span style={{ fontSize: '48px', display: 'inline-block', animation: 'bounce 2s infinite' }}>🍬</span>
            Sweet Shop Management
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ 
              color: '#d63384', 
              fontWeight: 700, 
              fontSize: '16px',
              background: 'linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.5)'
            }}>
              👋 Welcome, {user?.username}!
            </span>
            {isAdmin() && (
              <button onClick={handleAddSweet} className="btn btn-success">
                ✨ Add Sweet
              </button>
            )}
            <button onClick={logout} className="btn btn-secondary">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="alert alert-error" onClick={() => setError('')} style={{ cursor: 'pointer' }}>
            {error} (Click to dismiss)
          </div>
        )}

        <SearchBar
          filters={searchFilters}
          onFilterChange={setSearchFilters}
          categories={categories}
        />

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : filteredSweets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🍭</div>
            <h3 style={{ 
              color: '#d63384', 
              fontSize: '28px', 
              fontFamily: "'Fredoka One', cursive",
              marginBottom: '12px'
            }}>
              No sweets found
            </h3>
            <p style={{ color: '#666', marginTop: '10px', fontSize: '16px', fontWeight: 600 }}>
              {isAdmin() ? '✨ Try adding some delicious sweets to get started! ✨' : 'Check back later for more treats!'}
            </p>
          </div>
        ) : (
          <div className="grid">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onEdit={isAdmin() ? handleEditSweet : undefined}
                onDelete={isAdmin() ? handleDeleteSweet : undefined}
                onRestock={isAdmin() ? handleRestock : undefined}
              />
            ))}
          </div>
        )}

        {showModal && (
          <SweetModal
            sweet={editingSweet}
            onClose={handleModalClose}
            onSave={async (data) => {
              try {
                if (editingSweet) {
                  await sweetService.updateSweet(editingSweet.id, data);
                } else {
                  await sweetService.createSweet(data);
                }
                handleModalClose();
              } catch (err: any) {
                setError(err.response?.data?.error || 'Save failed');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

