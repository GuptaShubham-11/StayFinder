import { Route, Routes } from 'react-router-dom';
import { Signin, Signup, Spinner } from './components';
import AboutUs from './components/About';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { userApi } from './api/userApi';

function App() {
  const { login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        if (response.statusCode < 400) {
          login(response.data);
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <h1>Home</h1>
          </PublicRoute>
        }
      />
      <Route
        path="/listings"
        element={
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Signin />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default App;
