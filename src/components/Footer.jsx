import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer>
    <div className="footer-black-line"></div>
    <p>&copy; {new Date().getFullYear()} Pokédex. All rights reserved.</p>
  </footer>
);

export default Footer;
