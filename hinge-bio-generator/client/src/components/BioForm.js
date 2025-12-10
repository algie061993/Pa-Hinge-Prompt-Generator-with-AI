import React, { useState } from "react";
import "../styles/BioForm.modern.css";
import { FiSend, FiLoader } from "react-icons/fi";

const BioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    age: "",
    location: "",
    gender: "",
    keyInterests: [],
    desiredVibe: "funny",
    tone: "playful",
  });
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (
      interestInput.trim() &&
      !formData.keyInterests.includes(interestInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keyInterests: [...prev.keyInterests, interestInput.trim()],
      }));
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      keyInterests: prev.keyInterests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.age ||
      !formData.location ||
      !formData.gender ||
      formData.keyInterests.length === 0
    ) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Just pass the form data without calling generateBios
      onSuccess({
        userParams: formData,
      });
      // Don't clear the form - keep it for prompt generation
      setInterestInput("");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bio-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="age">Age *</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          min="18"
          max="100"
          placeholder="Enter your age"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="e.g., New York, California"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender *</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="non-binary">Non-binary</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="interests">Key Interests *</label>
        <div className="interest-input-group">
          <input
            type="text"
            id="interests"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder="e.g., hiking, cooking, reading"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="btn-add-interest"
          >
            Add
          </button>
        </div>
        <div className="interests-list">
          {formData.keyInterests.map((interest) => (
            <span key={interest} className="interest-tag">
              {interest}
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="btn-remove-interest"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="vibe">Desired Vibe *</label>
        <select
          id="vibe"
          name="desiredVibe"
          value={formData.desiredVibe}
          onChange={handleInputChange}
        >
          <option value="funny">Funny 😂</option>
          <option value="serious">Serious 🎯</option>
          <option value="quirky">Quirky 🌟</option>
          <option value="romantic">Romantic 💕</option>
          <option value="adventurous">Adventurous 🚀</option>
          <option value="intellectual">Intellectual 🧠</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tone">Tone</label>
        <select
          id="tone"
          name="tone"
          value={formData.tone}
          onChange={handleInputChange}
        >
          <option value="playful">Playful</option>
          <option value="witty">Witty</option>
          <option value="romantic">Romantic</option>
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? (
          <>
            <FiLoader className="spinner" />
            Loading...
          </>
        ) : (
          <>
            <FiSend />
            Next
          </>
        )}
      </button>
    </form>
  );
};

export default BioForm;
