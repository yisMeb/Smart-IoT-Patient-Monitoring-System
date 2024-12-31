import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserRole } from './UserRoleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { roleName, isAuthenticated } = useUserRole();
  const location = useLocation();

  if (!isAuthenticated || !roleName) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleName !== requiredRole) {
    return <Navigate to="/Not-Found" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;