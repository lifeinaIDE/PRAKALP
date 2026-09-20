/**
 * RequireAuth.tsx
 * Route guard — wraps /app/* routes.
 * - Not logged in → redirect to /login
 * - Wrong role for this section → redirect to own dashboard
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RoleSection = 'steward' | 'reviewer' | 'admin';

const roleDashboard: Record<string, string> = {
  'CPSE Data Steward':  '/app/steward/dashboard',
  'Technical Reviewer': '/app/reviewer/dashboard',
  'National Admin':     '/app/admin/dashboard',
};

interface Props {
  section: RoleSection;
  children: React.ReactNode;
}

export function RequireAuth({ section, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const sectionRoleMap: Record<RoleSection, string> = {
    steward:  'CPSE Data Steward',
    reviewer: 'Technical Reviewer',
    admin:    'National Admin',
  };

  if (user.role !== sectionRoleMap[section]) {
    // Wrong role — redirect to their own dashboard
    const dest = roleDashboard[user.role] ?? '/login';
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
}
