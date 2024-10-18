import React from 'react';
import './TitleGradient.css';

interface TitleGradientProps {
  children: React.ReactNode;
}

const TitleGradient: React.FC<TitleGradientProps> = ({ children }) => {
  return (
    <h1 className="title-gradient">
      {children}
    </h1>
  );
};

export default TitleGradient;

