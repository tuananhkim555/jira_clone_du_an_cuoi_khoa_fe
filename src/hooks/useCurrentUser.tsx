import { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export const useCurrentUser = () => {
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    // If you need to perform any side effects when the component mounts,
    // you can do it here. For now, we'll just log the current user.
    console.log('Current user:', currentUser);
  }, [currentUser]);

  return currentUser;
};
