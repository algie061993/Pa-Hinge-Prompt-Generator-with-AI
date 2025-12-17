import React, { useState } from "react";
import "../styles/BioForm.modern.css";
import { FiSend, FiLoader } from "react-icons/fi";

const BioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({

    location: "",
    gender: "",
    keyInterests: [],
    desiredVibe: "funny",
    tone: "playful",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.location ||
      !formData.gender ||
      formData.keyInterests.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Just pass the form data without calling generateBios
      onSuccess({
        userParams: formData,
      });
      // Don't clear the form - keep it for prompt generation
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
        <label htmlFor="interest1">Interest 1 *</label>
        <select
          id="interest1"
          value={formData.keyInterests[0] || ""}
          onChange={(e) => {
            const newInterests = [...formData.keyInterests];
            if (e.target.value) {
              newInterests[0] = e.target.value;
            } else {
              newInterests.splice(0, 1);
            }
            setFormData(prev => ({ ...prev, keyInterests: newInterests }));
          }}
          required
        >
          <option value="">Select first interest</option>
          {["travel", "cooking", "fitness", "music", "photography", "reading",
            "hiking", "art", "movies", "dancing", "gaming", "sports",
            "wine", "coffee", "yoga", "writing", "fashion", "tech",
            "dogs", "cats", "beach", "mountains", "food", "comedy"].map(interest => (
            <option key={interest} value={interest}>
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="interest2">Interest 2</label>
        <select
          id="interest2"
          value={formData.keyInterests[1] || ""}
          onChange={(e) => {
            const newInterests = [...formData.keyInterests];
            if (e.target.value) {
              newInterests[1] = e.target.value;
            } else {
              newInterests.splice(1, 1);
            }
            setFormData(prev => ({ ...prev, keyInterests: newInterests }));
          }}
        >
          <option value="">Select second interest (optional)</option>
          {["travel", "cooking", "fitness", "music", "photography", "reading",
            "hiking", "art", "movies", "dancing", "gaming", "sports",
            "wine", "coffee", "yoga", "writing", "fashion", "tech",
            "dogs", "cats", "beach", "mountains", "food", "comedy"]
            .filter(interest => interest !== formData.keyInterests[0])
            .map(interest => (
            <option key={interest} value={interest}>
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </option>
          ))}
        </select>
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
