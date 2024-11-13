import React, { useEffect, createContext, useContext, useState } from 'react';
import { auth } from '../lib/firebaseConfig'; 
import {setIdTokenCookie, getRoleFromCookies} from '../lib/cookieUtils'

interface UserRoleContextType {
  roleName: string | null;
  setRoleName: (role: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  refreshIdToken: () => Promise<string | null>;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [roleName, setRoleName] = useState<string | null>(() => {
    const savedRole = localStorage.getItem('role');
    return savedRole ? JSON.parse(savedRole) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    return authStatus ? JSON.parse(authStatus) : false;
  });

  const refreshIdToken = async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newIdToken = await currentUser.getIdToken(true);
        const role_name = getRoleFromCookies();
        setIdTokenCookie(newIdToken, role_name);
        return newIdToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed: ', error);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshIdToken()
      const refreshInterval = setInterval(async () => {
         await refreshIdToken();
      },   10 * 60 * 1000); 
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated]);


  const handleSetRoleName = (role: string | null) => {
    setRoleName(role);
    if (role) {
      localStorage.setItem('role', JSON.stringify(role));
    } else {
      localStorage.removeItem('role');
    }
  };

  const handleSetIsAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
    localStorage.setItem('isAuthenticated', JSON.stringify(value));
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setRoleName(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
    //Clear any auth related cookies
    document.cookie = 'idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return (
    <UserRoleContext.Provider 
      value={{ 
        roleName, 
        setRoleName: handleSetRoleName,
        isAuthenticated,
        setIsAuthenticated: handleSetIsAuthenticated,
        logout,
        refreshIdToken
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}