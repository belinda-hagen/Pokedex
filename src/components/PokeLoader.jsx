import React from "react";
import "./PokeLoader.css";

const PokeLoader = () => (
  <div className="poke-loader-container">
    <img
      src="/gif/Running-Pikachu-GIF.webp"
      alt="Running Pikachu Loader"
      className="poke-loader-gif"
    />
    <div className="poke-loader-line"></div>
  </div>
);

export default PokeLoader;
