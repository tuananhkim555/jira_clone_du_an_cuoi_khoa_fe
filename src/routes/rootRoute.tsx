import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ClientRoute from './clinentRoute';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
 
  return (
    <div className={`flex ${isAuthPage ? '' : 'flex-col md:flex-row'}`}>
      {!isAuthPage && (
       <>
          <div className="m-7">
            <Navbar />
          </div>
          <div className="ml-[270px]">
            <Sidebar onMenuClick={(menu) => console.log(menu)} />
          </div>
          <div className="flex-grow">    
            <ClientRoute />
          </div>
        </>
      )}
      {isAuthPage && (
        <div className="flex-grow">    
          <ClientRoute />
        </div>
      )}
    </div>
  );
};

const RootRoute: React.FC = () => {
  return (
    <LoadingProvider>
      <Router>
        <MainLayout />
      </Router>
    </LoadingProvider>
  );
};

export default RootRoute;

