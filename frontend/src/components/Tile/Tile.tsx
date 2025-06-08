import React from 'react';
import './Tile.css';

interface TileProps {
  label: string;
  icon: React.ReactNode;
  bgColor?: string;
  hoverColor?: string;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ label, icon, onClick, bgColor, hoverColor }) => {
  return (
    <button
      className="tile"
      onClick={onClick}
      style={
        {
          '--tile-bg': bgColor,
          '--tile-bg-hover': hoverColor,
        } as React.CSSProperties
      }
    >
      <span className="tile-label text-xl">{label}</span>
      <span className="tile-icon">{icon}</span>
    </button>
  );
};


export default Tile;

