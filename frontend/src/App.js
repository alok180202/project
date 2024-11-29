import React, { useState } from 'react';
import axios from 'axios';

function CodeAnalyzer() {
    const [codeSnippet, setCodeSnippet] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

    const handleAnalyzeCode = () => {
        setError('');
        axios.post('http://localhost:5000/analyze', { code: codeSnippet })
            .then(response => {
                setSuggestions(response.data.suggestions || []);
            })
            .catch(error => {
                console.error('Error analyzing code:', error);
                setError('There was an error analyzing the code. Please try again.');
            });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Code Review Assistant</h1>
            <textarea
                rows="8"
                cols="50"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste your code snippet here..."
            />
            <br />
            <button onClick={handleAnalyzeCode} style={{ margin: '10px' }}>
                Analyze Code
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Suggestions:</h2>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
}

export default CodeAnalyzer;
