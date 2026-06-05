import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routers';
import { GlobalErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
};

export default App;
