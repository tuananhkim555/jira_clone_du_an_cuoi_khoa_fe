import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Sidebar from '../common/components/Sidebar';

import ClientRoute from './clinentRoute';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  useEffect(() => {
    if (isAuthPage && localStorage.getItem('authToken')) {
      navigate('/board', { replace: true });
    }
  }, [isAuthPage, navigate]);

  return (
    <div className={`flex ${isAuthPage ? '' : 'flex-col md:flex-row'}`}>
      {!isAuthPage && (
       <>
          <div className="ml-[250px]">
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
