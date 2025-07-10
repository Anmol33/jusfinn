import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkExistingAuth, validateToken } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const existingAuth = checkExistingAuth();
        
        if (!existingAuth) {
          setIsAuthenticated(false);
          return;
        }

        // Validate the token with the backend
        const isValid = await validateToken(existingAuth.access_token);
        
        if (!isValid) {
          // Token is invalid, clear it
          localStorage.removeItem('auth');
        }
        
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Verifying access...</h2>
            <p className="text-gray-500 mt-2">Please wait while we verify your authentication.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 