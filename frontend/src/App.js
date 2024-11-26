import React, { useState } from 'react';
import axios from 'axios';

function CodeAnalyzer() {
    const [code, setCode] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleAnalyze = () => {
        axios.post('http://127.0.0.1:5000/analyze', { code })
            .then(response => {
                setSuggestions(response.data.suggestions);
            })
            .catch(error => {
                console.error("There was an error analyzing the code!", error);
            });
    };

    return (
        <div>
            <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter your code here"
            />
            <button onClick={handleAnalyze}>Analyze Code</button>
            <div>
                <h3>Suggestions:</h3>
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CodeAnalyzer;
