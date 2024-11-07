import React from 'react';
import '../../../styles/TitleGradient.css';

interface TitleGradientProps {
  children: React.ReactNode;
  className?: string;
}

const TitleGradient: React.FC<TitleGradientProps> = ({ children, className }) => {
  return (
    <h1 className="title-gradient">
      {children}
    </h1>
  );
};

export default TitleGradient;
