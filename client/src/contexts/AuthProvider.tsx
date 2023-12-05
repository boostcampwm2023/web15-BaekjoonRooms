import { useNavigate } from 'react-router-dom';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CreateUser } from '../types/CreateUserType';
import axios from 'axios';

interface AuthContextType {
  user: CreateUser | null;
}

interface AuthUpdateType {
  onLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const baseURL = import.meta.env.VITE_BASE_URL;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AuthUpdateContext = createContext<AuthUpdateType>({} as AuthUpdateType);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<CreateUser | null>(null);

  const onLogout = () => {
    // TODO: waiting for server api
    axios.get(`${baseURL}/auth/logout`, { withCredentials: true });
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    async function getSession() {
      const response = await axios.get(`${baseURL}/session`, {
        withCredentials: true,
      });
      return response;
    }

    getSession().then((session) => {
      if (session) {
        setUser(session.data);
      } else {
        setUser(null);
      }
    });
  }, []);

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
