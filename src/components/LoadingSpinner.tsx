import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 50, color = '#4B5563' }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center">
      <FaSpinner size={size} color={color} className="loader" />
    </div>
  );
};

export default LoadingSpinner;
