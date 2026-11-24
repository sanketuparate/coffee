import React, { useState } from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Account authentication modal:
 * Supports sign-in and account creation tabs, form validation, and demo feedback.
 */
export function AccountModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useLockBodyScroll(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid atelier email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    // Front-end simulation
    setSuccess(isSignUp ? 'Account created! Welcome to POUR / PLAY.' : 'Signed in successfully. Welcome back.');
    setTimeout(() => {
      onClose();
      setSuccess('');
      setEmail('');
      setPassword('');
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card account-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close sign in (Esc)"
        >
          ✕
        </button>

        <div className="account-modal-header">
          <span className="account-kicker">MEMBER ATELIER</span>
          <h2 className="account-title">{isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}</h2>
          <p className="account-subtitle">
            {isSignUp
              ? 'Join our private cellar allocation and seasonal release list.'
              : 'Access your cellar allocations, order history, and preferences.'}
          </p>
        </div>

        <form className="account-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="account-email">EMAIL ADDRESS</label>
            <input
              id="account-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sommelier@pourplay.com"
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="account-password">PASSWORD</label>
            <input
              id="account-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="form-error-msg" role="alert">{error}</div>}
          {success && <div className="form-success-msg" role="status">{success}</div>}

          <button type="submit" className="pill-button pill-button-dark w-full mt-2">
            <span>{isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN TO RITUAL'}</span>
          </button>

          <div className="account-switch-row">
            {isSignUp ? (
              <span>
                Already have an atelier account?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                  }}
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                >
                  Create account
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
