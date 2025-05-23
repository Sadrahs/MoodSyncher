import React, { useEffect, useState } from "react";

import "./Home.css";
import banner from "../assets/Hero.jpg";
import "./heroMorph.css";
import PopularMovies from "./PopularMovies";

const TMDB_API_KEY = "310876c027113d376303d32372360b53";

export default function Home() {

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".Navbar");
      const overlay = document.getElementById("blurOverlay");
  
      // Navbar shrink logic
      if (window.scrollY > 10) {
        nav?.classList.add("shrink");
      } else {
        nav?.classList.remove("shrink");
      }
  
      // Blur overlay logic
      const maxScroll = 300; // Adjust this
      const scrollY = Math.min(window.scrollY, maxScroll);
      const opacity = scrollY / maxScroll;
      const blur = (scrollY / maxScroll) * 10;
  
      if (overlay) {
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity * 0.6})`;
        overlay.style.backdropFilter = `blur(${blur}px)`;
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <>
      {/* Fixed background only for hero */}
      <div
        className="FixedBackground"
        style={{ backgroundImage: `url(${banner})` }}
        
      />
      <div className="BackgroundOverlay" id="blurOverlay" />

      <div className="HeroWrapper">
        <h1>
          LET'S FIND YOUR NEXT <span>MOVIE</span>
        </h1>
        <p>Your personalized movie matchmaker</p>
      </div>

      <section className="carousel-setting">
        <PopularMovies />
      </section>
    </>
  );
}
