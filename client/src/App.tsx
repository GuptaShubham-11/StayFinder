import { Route, Routes } from 'react-router-dom';
import { Signin, Signup, Spinner } from './components';
import AboutUs from './components/About';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { userApi } from './api/userApi';
import Listings from './pages/Listing';
import Layout from './components/Layout';
import { CreateListingForm } from './components/CreateListing';
import ListingDetails from './pages/DetailsListing';
import MyBookings from './pages/MyBooking';
import HostListings from './pages/HostListings';
import WishlistPage from './pages/Wishlist';
import LandingPage from './pages/Home';

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
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/listings"
          element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/create-listing"
          element={
            <ProtectedRoute>
              <CreateListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id"
          element={
            <ProtectedRoute>
              <ListingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/host-listings"
          element={
            <ProtectedRoute>
              <HostListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/user-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlists"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
      </Route>
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
