import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MovieRec from "./components/MovieRec";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* ✅ Correct component usage */}
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/recommend" element={<MovieRec />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
