import React, { useState } from "react";
import "../styles/BioForm.modern.css";
import { FiSend, FiLoader } from "react-icons/fi";

const BioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    desiredVibe: "funny",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVibeChange = (value) => {
    setFormData({ desiredVibe: value });
    setError("");
    setLoading(true);
    
    try {
      onSuccess({ userParams: { desiredVibe: value } });
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bio-form">
      <div className="vibe-grid">
        {[
          { value: "funny", label: "Funny", emoji: "😂", color: "#ffe66d" },
          { value: "romantic", label: "Romantic", emoji: "❤️", color: "#ff6b6b" },
          { value: "adventurous", label: "Adventurous", emoji: "🌟", color: "#4ecdc4" },
          { value: "quirky", label: "Quirky", emoji: "🎨", color: "#a29bfe" },
          { value: "serious", label: "Serious", emoji: "💼", color: "#74b9ff" },
          { value: "intellectual", label: "Intellectual", emoji: "🧠", color: "#fd79a8" },
        ].map((vibe) => (
          <div
            key={vibe.value}
            className={`vibe-card ${formData.desiredVibe === vibe.value ? 'selected' : ''}`}
            style={{ '--vibe-color': vibe.color }}
            onClick={() => handleVibeChange(vibe.value)}
          >
            <div className="vibe-emoji">{vibe.emoji}</div>
            <div className="vibe-label">{vibe.label}</div>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default BioForm;
