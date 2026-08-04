import { Outlet, Navigate } from 'react-router-dom'
import useUser from '../hooks/useUser'

const ProtectedRoutes = () => {
  let { token } = useUser()

  if (!token)
  {
    token=localStorage.getItem('token')
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoutes
