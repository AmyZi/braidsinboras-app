"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/globals.css";

export default function FooterLogo() {
  return (
    <div className="cta-footer">
      BRAIDS BY AMY · BORÅS · SWEDEN
      <span style={{ margin: "0 0.5rem", opacity: 0.3 }}>·</span>
      <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>Built by </span>
      <motion.a
        href="https://www.amicodes.com"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ 
          opacity: 1, 
          scale: 1.05, 
          filter: "drop-shadow(0 0 5px var(--gold))" 
        }}
        style={{ 
          opacity: 0.6, 
          transition: '0.3s', 
          display: "inline-flex", 
          alignItems: "center", 
          verticalAlign: "middle" 
        }}
      >
        <svg 
          viewBox="0 0 320 120"
          xmlns="http://www.w3.org/2000/svg"
          height="1.2em"
          fill="none"
        >
          <text 
            x="50%" y="80"
            textAnchor="middle"
            fontSize="70"
            fontFamily="Brush Script MT, Pacifico, cursive"
            fill="#e53935"
          >
            Amina
          </text>
          <path
            d="M170 18 C170 8, 185 8, 185 18 C185 8, 200 8, 200 18 C200 30, 185 38, 185 38 C185 38, 170 30, 170 18 Z"
            fill="#1e40af"
          />
        </svg>
      </motion.a>
    </div>
  );
}