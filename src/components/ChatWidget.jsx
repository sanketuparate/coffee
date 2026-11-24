import React, { useState, useRef, useEffect } from 'react';

/**
 * Interactive coffee concierge chat widget.
 * Features a welcoming sommelier persona and demo responses.
 */
export function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'sommelier',
      text: 'Greetings. I am your extraction sommelier at POUR / PLAY. How may I assist your coffee preparation or bean selection today?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userText }
    ]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'sommelier',
          text:
            'For optimal clarity with our single-origin roasts, we recommend heating mineral-balanced water to 93.5°C with a 45-second bloom followed by a center-spiral pour in 1:16 ratio.'
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-card-panel" role="dialog" aria-label="Sommelier Concierge Chat">
      <div className="chat-card-header">
        <div className="chat-header-info">
          <span className="chat-status-dot" />
          <div>
            <h4 className="chat-concierge-title">SOMMELIER CONCIERGE</h4>
            <span className="chat-concierge-status">Atelier Online · Zürich</span>
          </div>
        </div>
        <button
          type="button"
          className="chat-close-btn"
          onClick={onClose}
          aria-label="Close concierge chat"
        >
          ✕
        </button>
      </div>

      <div className="chat-thread-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-wrap ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-sommelier'}`}
          >
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble-wrap chat-bubble-sommelier">
            <div className="chat-bubble typing-dots">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask about roast notes, water ppm, or grind..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          aria-label="Chat query input"
        />
        <button type="submit" className="chat-send-btn" aria-label="Send message">
          →
        </button>
      </form>
    </div>
  );
}
