import { Outlet } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
