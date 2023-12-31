import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export default function UserBasedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, isLoading, setIsLoading } = useAuthContext();
  const location = useLocation();

  if (!isLoading) {
    setIsLoading(true);
    if (user) {
      if (user.participatingRoomCode) {
        if (location.pathname !== `/room/${user.participatingRoomCode}`) {
          return (
            <Navigate
              to={`/room/${user.participatingRoomCode}`}
              state={{
                isHost: user.isHost,
                roomCode: user.participatingRoomCode,
              }}
              replace
            />
          );
        }
      } else {
        if (location.pathname !== '/lobby') {
          return <Navigate to="/lobby" replace />;
        }
      }
    } else {
      if (location.pathname !== '/' && location.pathname !== '/home') {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}
