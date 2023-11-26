import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSession } from '../apis/Auth';
import { UserType } from '../types/UserType';

interface AuthContextType {
  user: UserType | null;
}

interface AuthUpdateType {
  onLogout: () => void;
}

// TODO: 서버의 세션 확인 api가 개발 되면 그때 localStorage로직을 변경

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AuthUpdateContext = createContext<AuthUpdateType>({} as AuthUpdateType);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  // const navigate = useNavigate();

  const { data, error } = useSuspenseQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
  });

  if (error) {
    throw error;
  }

  // 새로고침하면 여기서 다시 user가 null이 되어, 로그인이 풀린다...
  const user = data;

  // const onLogin = async () => {
  //   const res = await login();
  //   setUser(res);
  //   // 이를 해결하기 위해 로컬스토리지에 저장한다. 추후에 서버에서 세션을 관리하면 만료시간에 관한 로직도 추가해야 한다.
  //   localStorage.setItem('user', JSON.stringify(res));
  //   navigate('/lobby');
  // };

  const onLogout = () => {
    console.log('로그아웃');
  };

  // useEffect(() => {
  //   // 새로고침 시 로컬스토리지에서 user를 가져온다.
  //   if (localStorage.getItem('user')) {
  //     // 로컬스토리지에 user가 있으면 setUser한다.
  //     setUser(JSON.parse(localStorage.getItem('user') as string));
  //   }
  // }, []);

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
