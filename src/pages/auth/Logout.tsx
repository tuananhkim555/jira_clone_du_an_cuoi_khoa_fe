import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate as useNav } from 'react-router-dom';
import { clearToken } from '../../store';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNav();

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  // Phần còn lại của component Logout
};

export default Logout;
