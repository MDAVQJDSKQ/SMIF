import React, { useState } from 'react';
import { fetchData } from '../utils/api';

function TranscriptAnalyzer() {
  const [ticker, setTicker] = useState('');
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [copyNotification, setCopyNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTranscript('');
    setError('');

    const apiKey = localStorage.getItem('fmpApiKey');
    if (!apiKey) {
      setError('Please enter your API key first.');
      return;
    }

    try {
      const data = await fetchData(`earning_call_transcript/${ticker}`, ticker, 'annual', 1, apiKey, { year, quarter });
      if (data && data.length > 0) {
        // Placeholder function for LLM processing
        const processedTranscript = processTranscript(data[0].content);
        setTranscript(processedTranscript);
      } else {
        setError('No transcript found for the given parameters.');
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setError(`An error occurred while fetching the transcript: ${error.message}`);
    }
  };

  // Placeholder function for LLM processing
  const processTranscript = (rawTranscript) => {
    // For now, just return the raw transcript
    return rawTranscript;
  };

  return (
    <div className="transcript-analyzer">
      <h1>Earnings Call Transcript Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Ticker"
            required
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            required
          />
          <input
            type="number"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            placeholder="Quarter"
            min="1"
            max="4"
            required
          />
          <button type="submit">Fetch Transcript</button>
          <button type="button" onClick={() => navigator.clipboard.writeText(transcript)} disabled={!transcript}>
            Copy Transcript
          </button>
        </div>
      </form>
      {error && <div className="error-message">{error}</div>}
      {transcript && (
        <div className="transcript-container">
          <h2>Earnings Call Transcript</h2>
          <div className="transcript-content">{transcript}</div>
        </div>
      )}
      {copyNotification && (
        <div className="copy-notification">Transcript copied to clipboard!</div>
      )}
    </div>
  );
}

export default TranscriptAnalyzer;
