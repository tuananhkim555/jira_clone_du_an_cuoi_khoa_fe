import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // You can choose to return a default value instead of throwing an error
    return { currentUser: null, setCurrentUser: () => {} };
    // Or you can still throw an error, but with more information
    // throw new Error('useUser must be used within a UserProvider. Check if UserProvider is wrapping this component.');
  }
  return context;
};
