import React, { useState } from "react";
import "../styles/BioForm.modern.css";
import { FiSend, FiLoader } from "react-icons/fi";

const BioForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    desiredVibe: "funny",
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

    // No required profile fields anymore; only vibe is needed

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
        <label htmlFor="vibe">Desired Vibe *</label>
        <select
          id="vibe"
          name="desiredVibe"
          value={formData.desiredVibe}
          onChange={handleInputChange}
        >
          <option value="funny">Funny</option>
          <option value="serious">Serious</option>
          <option value="quirky">Quirky</option>
          <option value="romantic">Romantic</option>
          <option value="adventurous">Adventurous</option>
          <option value="intellectual">Intellectual</option>
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
