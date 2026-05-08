import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';

export default function ProtectedRoute() {
  const { accessToken } = useAppSelector((s) => s.auth);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
