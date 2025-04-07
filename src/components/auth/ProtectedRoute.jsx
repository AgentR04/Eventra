import { Navigate } from 'react-router-dom';
import { useFirebase } from '../../firebase/FirebaseContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useFirebase();
  
  // Show loading state while authentication state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
