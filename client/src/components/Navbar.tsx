// components/Navbar.tsx
import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Logo">MoodSyncher</div>
      <div className="NavLinks">
        <a href="/">Home</a>
        <a href="/recommend">Recommend</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
