import { ReactNode, createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserSession } from '../types/UserSessionType';
import { logout } from '../apis/logout';
import { getSession } from '../apis/getSession';
import { useLocalStorage } from './useLocalStorage';

export interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
}

export interface AuthUpdateType {
  onLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
export const AuthUpdateContext = createContext<AuthUpdateType>(
  {} as AuthUpdateType,
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeItem } = useLocalStorage();

  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onLogout = async () => {
    await logout();
    removeItem('userInfo');
    navigate('/');
  };

  useEffect(() => {
    setIsLoading(true);
    getSession().then((data) => {
      if (data) {
        setUser(data);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, [location]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      <AuthUpdateContext.Provider value={{ onLogout }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};
