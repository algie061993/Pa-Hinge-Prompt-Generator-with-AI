import React, { useState } from "react";
import { generatePromptAnswers } from "../services/api";
import "../styles/PromptSelector.modern.css";
import { FiSend, FiLoader, FiX } from "react-icons/fi";

const HINGE_PROMPTS = {
  "About Me": [
    "This year, I really want to",
    "My greatest strength", 
    "I go crazy for",
    "Typical Sunday",
    "My simple pleasures",
    "My most irrational fear",
    "I recently discovered that",
    "A life goal of mine"
  ],
  "Getting Personal": [
    "My Love Language is",
    "The dorkiest thing about me is",
    "I won't shut up about",
    "The key to my heart is",
    "I geek out on",
    "Dating me is like",
    "The way to win me over is"
  ],
  "My Type": [
    "We're the same type of weird if",
    "I'll brag about you to my friends if",
    "I want someone who",
    "Green flags I look out for",
    "The hallmark of a good relationship is",
    "I'm weirdly attracted to",
    "I'm looking for",
    "We'll get along if",
    "Something that's non-negotiable for me is",
    "All I ask is that you",
    "I'd fall for you if"
  ],
  "Date Vibes": [
    "First round is on me if",
    "I know the best spot in town for",
    "Together, we could",
    "What I order for the table",
    "Let's debate this topic",
    "I bet you can't"
  ],
  "Let's Chat About Prompts": [
    "Change my mind about",
    "Give me travel tips for",
    "Teach me something about",
    "Try to guess this about me",
    "You should leave a comment if",
    "I'll pick the topic if you start the conversation",
    "The one thing I'd love to know about you is",
    "Let's make sure we're on the same page about",
    "Do you agree or disagree that"
  ],
  "Self-care Prompts": [
    "My friends ask me for advice about",
    "Therapy recently taught me",
    "I feel most supported when",
    "My last journal entry was about",
    "My cry-in-the-car song is",
    "A boundary of mine is",
    "I unwind by",
    "My self-care routine is",
    "I beat my blues by",
    "When I need advice, I go to",
    "My therapist would say I",
    "The last time I cried happy tears was"
  ]
};

const PromptSelector = ({ userParams, formActive, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("About Me");
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  if (!formActive) return null;

  const handlePromptToggle = (prompt) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(prev => prev.filter(p => p !== prompt));
    } else if (selectedPrompts.length < 3) {
      setSelectedPrompts(prev => [...prev, prompt]);
    }
    setResults(null);
    setError("");
  };

  const handleGenerateAnswers = async () => {
    if (selectedPrompts.length === 0) {
      setError("Please select at least one prompt");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await generatePromptAnswers(userParams, selectedPrompts);
      if (!response?.promptAnswers) {
        setError("No answers returned from server. Try again.");
        setResults(null);
      } else {
        setResults(response);
      }
    } catch (err) {
      setError(err.error || "Failed to generate answers");
    } finally {
      setLoading(false);
      setSelectedPrompts([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedPrompts([]);
    setResults(null);
  };

  return (
    <div className="prompt-selector-container">
      <div className="prompt-selector">
        <h2>Generate Hinge Prompt Answers</h2>
        <p className="prompt-subtitle">Select up to 3 prompts to generate personalized answers</p>
        
        <div className="ai-status available">
          <span>⚡ Fast Templates</span>
        </div>

        <div className="category-tabs">
          {Object.keys(HINGE_PROMPTS).map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="prompts-list">
          {HINGE_PROMPTS[selectedCategory].map((prompt) => (
            <label key={prompt} className="prompt-item">
              <input
                type="checkbox"
                checked={selectedPrompts.includes(prompt)}
                onChange={() => handlePromptToggle(prompt)}
                disabled={selectedPrompts.length >= 3 && !selectedPrompts.includes(prompt)}
              />
              <span className="prompt-text">{prompt}</span>
              {selectedPrompts.includes(prompt) && <span className="prompt-selected">✓</span>}
            </label>
          ))}
        </div>

        <div className="prompt-selection-info">
          <p>Selected: {selectedPrompts.length}/3</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          className="btn-generate-prompts"
          onClick={handleGenerateAnswers}
          disabled={loading || selectedPrompts.length === 0}
        >
          {loading ? (
            <>
              <FiLoader className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <FiSend />
              Generate Answers
            </>
          )}
        </button>
      </div>

      <div className="prompt-results-wrapper">
        {loading && (
          <div className="loading-placeholder">
            <FiLoader className="spinner" /> Generating answers...
          </div>
        )}
        
        {results && (
          <div className="prompt-results">
            <div className="results-header">
              <h2>Your Hinge Prompt Answers</h2>
              <button className="btn-clear-results" onClick={handleClearSelection} title="Clear">
                <FiX />
              </button>
            </div>

            {results.metadata && (
              <div className="source-stats">
                {Object.values(results.metadata).filter(m => m.source === 'AI').length > 0 && (
                  <span className="stat-item ai">🤖 {Object.values(results.metadata).filter(m => m.source === 'AI').length} AI-generated</span>
                )}
                {Object.values(results.metadata).filter(m => m.source === 'Template').length > 0 && (
                  <span className="stat-item">✨ {Object.values(results.metadata).filter(m => m.source === 'Template').length} Template</span>
                )}
              </div>
            )}

            <div className="answers-grid">
              {Object.keys(results.promptAnswers).map((prompt) => (
                <div key={prompt} className="answer-card">
                  <div className="answer-card-header">
                    <h3 className="prompt-question">{prompt}</h3>
                    <span className="source-badge">
                      {results.metadata?.[prompt]?.source === 'AI' ? '🤖' : '✨'}
                    </span>
                  </div>
                  <div className="answer-display">
                    <div
                      className="answer-text"
                      onClick={() => navigator.clipboard.writeText(results.promptAnswers[prompt])}
                      title="Click to copy"
                    >
                      {results.promptAnswers[prompt]}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="user-params-display">
              <h3>Your Profile</h3>
              <p>
                {results.userParams.age} years old • {results.userParams.location} • {results.userParams.desiredVibe} vibe
              </p>
              <div className="interests-display">
                {results.userParams.keyInterests?.map((interest) => (
                  <span key={interest} className="interest-badge">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="prompt-actions">
          <button className="btn-close-prompts" onClick={onClose} title="Close">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptSelector;