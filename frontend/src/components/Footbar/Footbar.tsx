import React from 'react';
import './Footbar.css';

const Footbar: React.FC = () => {
  return (
    <footer className="footbar">
      <div className="flex flex-col-reverse sm:flex-row text-center footbar-links">
        <a href="/policy" className="hover:underline mx-2 text-sky-500 underline">
          Politique de confidentialité
        </a>
        <a href="/terms" className="hover:underline mx-2 text-sky-500 underline">
          Nous contacter
        </a>
      </div>
      <p className="footbar-text">
        Fait par KangooRoad avec ❤️
      </p>
    </footer>
  );
};

export default Footbar;

