import React from 'react';
import './Tile.css';

interface TileProps {
  label: string;
  icon: React.ReactNode;
  bgColor?: string;
  hoverColor?: string;
  onClick: () => void;
  isAnimated?: boolean;
}

const Tile: React.FC<TileProps> = ({
  label,
  icon,
  onClick,
  bgColor,
  hoverColor,
  isAnimated = false
}) => {
  return (
    <button
      className="tile group flex flex-col items-center justify-center gap-3 rounded-xl p-6 transition-colors focus:outline-none"
      onClick={onClick}
      style={
        {
          '--tile-bg': bgColor,
          '--tile-bg-hover': hoverColor,
        } as React.CSSProperties
      }
    >
      <span className="tile-label text-xl transition-opacity duration-300">
        {label}
      </span>

      <span
        className={
          `tile-icon inline-flex transition-transform duration-300 
          ${isAnimated ? 'group-hover:scale-110 group-hover:-translate-y-0.5' : ''}`
        }
      >
        {icon}
      </span>
    </button>
  );
};

export default Tile;