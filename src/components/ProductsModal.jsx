import React, { useState } from 'react';
import { CONFIG } from '../config';
import { useCart } from '../context/CartContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Products catalogue modal:
 * Displays demo products with flavor profiles, price, and "Add to cart" buttons.
 */
export function ProductsModal({ isOpen, onClose, onOpenCart }) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  useLockBodyScroll(isOpen, onClose);

  if (!isOpen) return null;

  const handleAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card products-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close products modal (Esc)"
        >
          ✕
        </button>

        <div className="products-modal-header">
          <span className="products-kicker">CURATED ROASTS & HARDWARE</span>
          <h2 className="products-title">FIND YOUR CUP</h2>
          <p className="products-subtitle">
            Ethically sourced single origins and architectural brew equipment calibrated for daily contemplation.
          </p>
        </div>

        <div className="products-grid">
          {CONFIG.demoProducts.map((p) => (
            <div key={p.id} className="product-card">
              <div className="product-badge">{p.badge}</div>
              <div className="product-card-top">
                <h3 className="product-name">{p.name}</h3>
                <span className="product-origin">{p.origin}</span>
              </div>
              <p className="product-notes">{p.notes}</p>
              <div className="product-footer">
                <span className="product-price">${p.price}</span>
                <button
                  type="button"
                  className={`pill-button ${addedId === p.id ? 'pill-button-added' : 'pill-button-dark'}`}
                  onClick={() => handleAdd(p)}
                >
                  <span>{addedId === p.id ? 'ADDED ✓' : 'ADD TO CART'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="products-modal-footer">
          <button
            type="button"
            className="link-button view-cart-link"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
          >
            View Shopping Cart →
          </button>
        </div>
      </div>
    </div>
  );
}
