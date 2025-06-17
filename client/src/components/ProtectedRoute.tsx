import { useAuthStore } from '@/store/authStore';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/signin" replace />;
}
