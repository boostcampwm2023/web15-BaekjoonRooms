import { createContext, useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSession } from '../apis/Auth';
import { UserType } from '../types/UserType';

interface AuthContextType {
  user: UserType | null;
}

interface AuthUpdateType {
  onLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AuthUpdateContext = createContext<AuthUpdateType>({} as AuthUpdateType);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const { data: user, error } = useSuspenseQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
  });

  if (error) {
    throw error;
  }

  const onLogout = () => {
    console.log('로그아웃');
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <AuthUpdateContext.Provider value={{ onLogout }}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export const useAuthUpdateContext = () => useContext(AuthUpdateContext);
