import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageNotFound from '../../assets/page-not-found.svg';
import Reveal from '../../common/components/Reveal';
import LoadingSpinner from '../../common/components/LoadingSpinner';

const NotFound: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='h-screen overflow-hidden'>
     <Reveal>
      <div className="relative flex items-center justify-center h-screen">
        <img src={ImageNotFound} alt="Page Not Found" className="w-[80%] md:w-[80%] lg:w-[50%] object-contain" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">404 - Page Not Found</h1>
          <p className="text-xl mb-8 text-white">The page you are looking for doesn't exist.</p>
          <Link to="/board" className="bg-[#fff] text-purple-900 px-4 py-2 rounded hover:bg-purple-950  hover:text-white transition duration-300">
              Go Home
          </Link>
        </div>
      </div>
    </Reveal>
    </div>
  );
};

export default NotFound;
