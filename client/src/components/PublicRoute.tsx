import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { ReactNode } from 'react';

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  return !user ? <>{children}</> : <Navigate to="/listings" replace />;
}
