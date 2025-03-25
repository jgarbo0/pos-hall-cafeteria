
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import CustomerDetails from './pages/CustomerDetails';

import { Toaster as SonnerToaster } from 'sonner';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/menu" element={<Index />} />
            <Route path="/hall" element={<Hall />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/customer/:id" element={<CustomerDetails />} />
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
