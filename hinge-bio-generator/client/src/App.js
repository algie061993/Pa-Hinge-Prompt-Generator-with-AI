import React, { useState } from "react";
import "./styles/App.modern.css";
import { FiHeart, FiZap, FiStar, FiArrowRight } from "react-icons/fi";
import BioForm from "./components/BioForm";
import PromptSelector from "./components/PromptSelector";

function App() {
  const [formData, setFormData] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);

  const handleFormSuccess = (data) => {
    setFormData(data.userParams);
    setShowPrompts(true);
  };

  const handleClosePrompts = () => {
    setShowPrompts(false);
  };

  return (
    <div className="App">
      <header className="modern-header">
        <div className="header-content">
          <div className="logo">
            <FiHeart className="logo-icon" />
            <span className="logo-text">Hinge Bio Generator</span>
          </div>
          <div className="header-badge">
            <FiZap className="badge-icon" />
            <span>AI Powered</span>
          </div>
        </div>
      </header>

      <main className="main-container">
        {!showPrompts ? (
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">
                <FiStar className="star-icon" />
                <span>Generate Perfect Hinge Answers</span>
              </div>
              <h1 className="hero-title">
                Create Flirty Hinge Prompts
                <span className="gradient-text"> That Get Matches</span>
              </h1>
              <p className="hero-subtitle">
                Choose your vibe and get 20 unique answers for any Hinge prompt.
                Short, flirty, and conversation-starting.
              </p>
            </div>
            
            <div className="form-card">
              <div className="card-header">
                <h2>Choose Your Vibe</h2>
                <p>Select the personality that matches you best</p>
              </div>
              <BioForm onSuccess={handleFormSuccess} />
            </div>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">✨</div>
                <h3>7 Personality Vibes</h3>
                <p>Funny, romantic, adventurous & more</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <h3>53 Hinge Prompts</h3>
                <p>All the popular prompts covered</p>
              </div>
              <div className="feature">
                <div className="feature-icon">💬</div>
                <h3>7,420 Unique Answers</h3>
                <p>Never run out of fresh responses</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="prompts-container">
            <PromptSelector
              userParams={formData}
              formActive={showPrompts}
              onClose={handleClosePrompts}
            />
          </div>
        )}
      </main>

      <footer className="modern-footer">
        <p>
          Made with <FiHeart className="footer-heart" /> for better dating profiles
        </p>
      </footer>
    </div>
  );
}

export default App;
