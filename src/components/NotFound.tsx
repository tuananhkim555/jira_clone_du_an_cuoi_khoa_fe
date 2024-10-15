import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for doesn't exist.</p>
      <Link to="/kanban" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

