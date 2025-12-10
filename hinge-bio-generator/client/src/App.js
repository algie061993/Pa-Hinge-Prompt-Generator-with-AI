import React, { useState } from "react";
import "./styles/App.modern.css";
import Header from "./components/Header";
import BioForm from "./components/BioForm";
import PromptSelector from "./components/PromptSelector";

function App() {
  const [formData, setFormData] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);

  const handleFormSuccess = (data) => {
    setFormData(data.userParams);
    // flip to prompt selector
    setShowPrompts(true);
  };

  const handleClosePrompts = () => {
    // go back to form
    setShowPrompts(false);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-container">
        {!showPrompts ? (
          <div className="container">
            <div className="form-section">
              <h2>Tell us about yourself</h2>
              <BioForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        ) : (
          <div className="container with-prompts">
            <PromptSelector
              userParams={formData}
              formActive={showPrompts}
              onClose={handleClosePrompts}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          © 2025 Hinge Bio Generator. Powered by AI • Made with{" "}
          <span className="heart">❤️</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
