import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Slide-in right drawer for shopping cart.
 * Shows empty state, items with quantity adjustment, subtotal, and demo checkout notice.
 */
export function CartDrawer({ isOpen, onClose, onExploreProducts }) {
  const { cartItems, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  useLockBodyScroll(isOpen, onClose);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setCheckoutNotice(true);
    setTimeout(() => setCheckoutNotice(false), 3000);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <h2 className="cart-drawer-title">YOUR CART</h2>
            <span className="cart-drawer-count">({cartCount})</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="empty-cart-icon">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h3 className="empty-cart-heading">Your cart is empty</h3>
              <p className="empty-cart-desc">
                Begin your specialty extraction ritual by adding beans or brew equipment.
              </p>
              <button
                type="button"
                className="pill-button pill-button-dark"
                onClick={() => {
                  onClose();
                  onExploreProducts();
                }}
              >
                <span>CONTINUE SHOPPING</span>
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <span className="cart-item-origin">{product.origin}</span>
                    <span className="cart-item-unit-price">${product.price} each</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(product.id, -1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        –
                      </button>
                      <span className="qty-value">{quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(product.id, 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <span className="cart-item-total">${product.price * quantity}</span>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="subtotal-label">SUBTOTAL</span>
              <span className="subtotal-value">${cartSubtotal}.00</span>
            </div>
            <p className="cart-shipping-note">
              {cartSubtotal >= 40
                ? '✓ Complimentary worldwide delivery applied'
                : `Add $${40 - cartSubtotal} more for free worldwide shipping`}
            </p>

            {checkoutNotice && (
              <div className="checkout-demo-alert" role="status">
                Demo only — payment gateway integration disabled in preview.
              </div>
            )}

            <button
              type="button"
              className="pill-button pill-button-dark w-full checkout-btn"
              onClick={handleCheckout}
            >
              <span>PROCEED TO CHECKOUT</span>
              <span className="pill-button-icon">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
