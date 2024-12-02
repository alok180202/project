import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles.css";

function CodeAnalyzer() {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeResponse, setCodeResponse] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for messages from VS Code
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "analyzeCode") {
        setCodeSnippet(message.code); // Receive the code from the active file
        analyzeCode(message.code); // Automatically start analysis
      }
    });
  }, []);

  const analyzeCode = async (code) => {
    setError("");
    setLoading(true);
    setCodeResponse("");
    setSuggestions([]);
    try {
      // Fetch analysis from backend
      const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const jsonResponse = await response.json();

      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }

      setCodeResponse(jsonResponse.corrected_code);
      setSuggestions(jsonResponse.suggestions);
    } catch (err) {
      console.error(err);
      setError("There was an error analyzing the code.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="app-container">
      <h1>Code Review Assistant</h1>
      <button
        onClick={() => analyzeCode(codeSnippet)}
        disabled={loading || !codeSnippet}
        className="analyze-btn"
      >
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>
      {loading && <div className="loader"></div>}
      {error && <p className="error">{error}</p>}
      {codeResponse && (
        <div className="response-block">
          <h2>Optimal Code:</h2>
          <SyntaxHighlighter language="python" style={theme} className="code-block">
            {codeResponse}
          </SyntaxHighlighter>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(codeResponse)}
          >
            Copy Code
          </button>
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="response-block">
          <h2>Suggestions:</h2>
          <ul className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CodeAnalyzer;
