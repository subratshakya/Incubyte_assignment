import React, { useState } from 'react';
import { Sweet } from '../services/api';
import '../App.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: number, quantity: number) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: number) => void;
  onRestock?: (id: number, quantity: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showRestock, setShowRestock] = useState(false);

  const handlePurchase = () => {
    if (purchaseQuantity > 0 && purchaseQuantity <= sweet.quantity) {
      onPurchase(sweet.id, purchaseQuantity);
      setPurchaseQuantity(1);
    }
  };

  const handleRestock = () => {
    if (restockQuantity > 0) {
      onRestock?.(sweet.id, restockQuantity);
      setRestockQuantity(10);
      setShowRestock(false);
    }
  };

  const quantityClass = sweet.quantity === 0 ? 'out' : sweet.quantity < 10 ? 'low' : '';

  return (
    <div className="sweet-card">
      <h3>{sweet.name}</h3>
      <div className={`category`}>{sweet.category}</div>
      <div className="price">${sweet.price.toFixed(2)}</div>
      <div className={`quantity ${quantityClass}`}>
        {sweet.quantity === 0 ? 'Out of Stock' : `Stock: ${sweet.quantity}`}
      </div>

      <div style={{ marginTop: '15px' }}>
        {sweet.quantity > 0 ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
              style={{
                width: '60px',
                padding: '10px',
                border: '3px solid #ffb6c1',
                borderRadius: '12px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff6b9d';
                e.target.style.transform = 'scale(1.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ffb6c1';
                e.target.style.transform = 'scale(1)';
              }}
            />
            <button
              onClick={handlePurchase}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              🛒 Purchase
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" disabled style={{ width: '100%' }}>
            😢 Out of Stock
          </button>
        )}

        {onRestock && (
          <>
            {!showRestock ? (
              <button
                onClick={() => setShowRestock(true)}
                className="btn btn-success"
                style={{ width: '100%', marginTop: '8px' }}
              >
                📦 Restock
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 10)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '3px solid #ffb6c1',
                    borderRadius: '12px',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b9d';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ffb6c1';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <button onClick={handleRestock} className="btn btn-success">
                  ➕ Add
                </button>
                <button
                  onClick={() => setShowRestock(false)}
                  className="btn btn-secondary"
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </>
        )}

        {onEdit && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => onEdit(sweet)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              ✏️ Edit
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(sweet.id)}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

