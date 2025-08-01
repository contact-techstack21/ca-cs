import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'business' | 'professional' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}
