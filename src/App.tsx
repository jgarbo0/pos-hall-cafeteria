
import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Hall from './pages/Hall';
import Finance from './pages/Finance';
import Home from './pages/Home';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Landing from './pages/Landing';
import CustomerDetails from './pages/CustomerDetails';

import { Toaster as SonnerToaster } from 'sonner';
import { User } from './types';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    const isAuth = !!user;
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location } });
    }
  }, [navigate, location]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</h1>
        </div>
      </div>
    );
  }

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/hall" element={
              <ProtectedRoute>
                <Hall />
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path="/settings/*" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/customer/:id" element={
              <ProtectedRoute>
                <CustomerDetails />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SonnerToaster position="top-right" richColors />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
