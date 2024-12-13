import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { LoadingProvider } from '../context/LoadingContext';
import Sidebar from '../common/components/Sidebar';

import ClientRoute from './clinentRoute';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isLoggedIn = !!localStorage.getItem('authToken'); // Kiểm tra xem người dùng đã đăng nhập hay chưa

  useEffect(() => {
    if (isAuthPage && isLoggedIn) {
      navigate('/board', { replace: true });
    }
  }, [isAuthPage, navigate, isLoggedIn]);

  useEffect(() => {
    const handlePopState = () => {
      if (!isLoggedIn) {
        navigate('/board', { replace: true }); // Điều hướng về trang dashboard nếu chưa đăng xuất
      } else if (isAuthPage) {
        navigate('/board', { replace: true }); // Nếu đang ở trang auth mà đã đăng nhập, điều hướng về dashboard
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isLoggedIn, navigate, isAuthPage]);

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