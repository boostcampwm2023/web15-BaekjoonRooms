import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuthContext();

  console.log(user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
