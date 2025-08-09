import React from 'react';
import './Loading.css';
const Loading: React.FC = () => {
  return (
    <div className="loading-container min-h-screen flex items-center justify-center">
      <div className="loading-spinner"></div>
      <p className="loading-text">Chargement en cours...</p>
    </div>
  );
};

export default Loading;

