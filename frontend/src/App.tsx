import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { router } from './routers';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import { useRefreshMutation } from './features/store/services/rtkQueryStoreApi';
import { setCredentials, setInitializing } from './features/auth/store/authSlice';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await refresh().unwrap();
        dispatch(setCredentials({ token: result.token, user: result.user }));
      } catch (err) {
        dispatch(setInitializing(false));
      }
    };
    initAuth();
  }, [refresh, dispatch]);

  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
};

export default App;
