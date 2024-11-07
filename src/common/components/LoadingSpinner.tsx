import React from 'react';
import { ImCompass2 } from "react-icons/im";


interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 160, color = '#310150' }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[9999] overflow-hidden bg-gray-400 bg-opacity-10 backdrop-blur-sm flex flex-col items-center justify-center">
      <ImCompass2 size={size} color={color} className="loader" />
    </div>
  );
};

export default LoadingSpinner;
