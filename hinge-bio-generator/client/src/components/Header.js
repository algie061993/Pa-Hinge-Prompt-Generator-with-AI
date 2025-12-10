import React from "react";
import "../styles/Header.css";
import { FiHeart } from "react-icons/fi";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FiHeart className="logo-icon" />
          <h1>Hinge Bio Generator</h1>
        </div>
        <p className="subtitle">AI-Powered Hinge Bio Creation</p>
      </div>
    </header>
  );
};

export default Header;
