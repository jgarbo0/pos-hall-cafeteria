
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Hall from "./pages/Hall";
import Products from "./pages/Products";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { User } from "./types";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) as User : null;
    setIsAuthenticated(!!user);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with a redirect URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  // Initialize theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/index" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/hall" element={<ProtectedRoute><Hall /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
