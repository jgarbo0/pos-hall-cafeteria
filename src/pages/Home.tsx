
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    if (user) {
      // If user is logged in, redirect to dashboard or menu
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/menu');
      }
    } else {
      // If user is not logged in, redirect to landing page
      navigate('/landing');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</h1>
      </div>
    </div>
  );
};

export default Home;
