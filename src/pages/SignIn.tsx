import { Button } from "@/components/ui/button";
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkExistingAuth, validateToken } from '@/lib/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const existingAuth = checkExistingAuth();
        
        if (existingAuth) {
          // Validate the token with the backend
          const isValid = await validateToken(existingAuth.access_token);
          
          if (isValid) {
            // Token is valid, redirect to dashboard
            console.log('Valid token found, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
            return;
          } else {
            // Token is invalid, clear it
            console.log('Invalid token found, clearing auth data');
            localStorage.removeItem('auth');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('auth');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Get the authorization URL from backend
      const response = await api.get('/auth/google/login');
      const { authorization_url } = response.data;
      console.log(authorization_url);


      // Redirect user to Google OAuth
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      setLoading(false);
      alert('Failed to initiate Google login. Please try again.');
    }
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Checking authentication...</h2>
            <p className="text-gray-500 mt-2">Please wait while we verify your login status.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2">Sign in</h2>
        <p className="text-center text-gray-500 mb-6">Welcome back to your JusFinn workspace.</p>
        <div className="flex flex-col gap-3 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 text-base font-medium py-2" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><g><circle fill="#fff" cx="24" cy="24" r="24"/><path fill="#4285F4" d="M34.6 24.3c0-.7-.1-1.4-.2-2H24v4.1h6c-.3 1.6-1.4 2.9-2.9 3.7v3h4.7c2.7-2.5 4.3-6.1 4.3-10.1z"/><path fill="#34A853" d="M24 36c2.7 0 5-0.9 6.7-2.4l-4.7-3c-1.3.9-3 .1-3.7-1.1h-4.8v3.1C19.1 34.7 21.4 36 24 36z"/><path fill="#FBBC05" d="M16.2 28.5c-.3-.9-.5-1.8-.5-2.7s.2-1.8.5-2.7v-3.1h-4.8C10.5 22.1 10 23.9 10 25.8s.5 3.7 1.4 5.3l4.8-3.1z"/><path fill="#EA4335" d="M24 16.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C28.9 13.7 26.6 12.6 24 12.6c-2.6 0-5 1-6.7 2.7l4.8 3.1c.7-1.2 2.4-2 3.9-2z"/></g></svg>
            {loading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
        </div>
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" placeholder="Enter your password" />
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password? Reset</a>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn; 