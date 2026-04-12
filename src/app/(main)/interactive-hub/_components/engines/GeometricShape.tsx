import React from 'react';

export type ShapeType = 'circle' | 'square' | 'triangle' | 'rectangle' | 'diamond' | 'trapezoid' | 'pentagon' | 'hexagon';

interface Props {
  shape: ShapeType;
  size?: number;
  className?: string;
  color?: string;
}

const SHAPE_COLORS: Record<ShapeType, string> = {
  circle: '#ffaa8b',     // warm peach
  square: '#8aab9f',     // sage green
  triangle: '#8a64c8',   // purple
  rectangle: '#ffca8b',  // light orange
  diamond: '#ff8bca',    // pink
  trapezoid: '#8bcaff',  // sky blue
  pentagon: '#b2ff8b',   // lime
  hexagon: '#ffd78b',    // gold
};

export default function GeometricShape({ shape, size = 120, className = '', color }: Props) {
  const fillColor = color || SHAPE_COLORS[shape] || '#8aab9f';

  const renderShape = () => {
    switch (shape) {
      case 'circle':
        return <circle cx="50" cy="50" r="45" fill={fillColor} />;
      case 'square':
        return <rect x="10" y="10" width="80" height="80" rx="12" fill={fillColor} />;
      case 'triangle':
        return <path d="M50 10 L90 85 L10 85 Z" fill={fillColor} strokeLinejoin="round" />;
      case 'rectangle':
        return <rect x="5" y="20" width="90" height="60" rx="10" fill={fillColor} />;
      case 'diamond':
        return <path d="M50 5 L90 50 L50 95 L10 50 Z" fill={fillColor} strokeLinejoin="round" />;
      case 'trapezoid':
        return <path d="M30 15 L70 15 L95 85 L5 85 Z" fill={fillColor} strokeLinejoin="round" />;
      case 'pentagon':
        return <path d="M50 5 L95 40 L78 95 L22 95 L5 40 Z" fill={fillColor} strokeLinejoin="round" />;
      case 'hexagon':
        return <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill={fillColor} strokeLinejoin="round" />;
      default:
        return null;
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`drop-shadow-md drop-shadow-white animate-in zoom-in duration-500 ${className}`}
    >
      {renderShape()}
    </svg>
  );
}
