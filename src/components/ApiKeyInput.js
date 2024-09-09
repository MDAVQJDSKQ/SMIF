import React, { useState, useEffect } from 'react';

function ApiKeyInput() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('fmpApiKey') || '';
    setApiKey(savedApiKey);
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('fmpApiKey', apiKey);
      alert('API key saved successfully!');
    } else {
      alert('Please enter a valid API key.');
    }
  };

  return (
    <div className="api-key-input">
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your FMP API Key"
      />
      <button onClick={handleSaveApiKey} className="save-api-key-button">
        Save API Key
      </button>
    </div>
  );
}

export default ApiKeyInput;
