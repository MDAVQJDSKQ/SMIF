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
    <div className="api-key-container">
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Financial Modeling Prep API Key (Starter+)"
      />
      <button onClick={handleSaveApiKey}>Save API Key</button>
    </div>
  );
}

export default ApiKeyInput;
