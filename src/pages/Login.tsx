
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { User } from '@/types';

// Predefined users for Somalia
const predefinedUsers: User[] = [
  {
    id: '1',
    name: 'Abdirahman Mohamed',
    email: 'admin@somalipos.com',
    role: 'admin',
    avatar: '/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png'
  },
  {
    id: '2',
    name: 'Amina Hassan',
    email: 'cashier@somalipos.com',
    role: 'cashier',
    avatar: '/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png'
  },
  {
    id: '3',
    name: 'Faisal Ahmed',
    email: 'manager@somalipos.com',
    role: 'manager',
    avatar: '/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png'
  }
];

// Form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // Check if the email matches one of our predefined users
      const user = predefinedUsers.find(user => user.email === values.email);
      
      if (user && values.password === 'password') { // Simple password check
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Logged in successfully');
        
        // Redirect admin users to dashboard, others to home page
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // Use the from location if available, otherwise go to home
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        toast.error('Invalid email or password');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (userEmail: string) => {
    form.setValue('email', userEmail);
    form.setValue('password', 'password');
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="flex justify-end mb-4">
        <Link to="/landing">
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Somali POS System</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access the dashboard</p>
          </div>
          
          <Card className="w-full shadow-lg border-0 dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Quick login as:
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickLogin('admin@somalipos.com')}
                >
                  Abdirahman (Admin)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickLogin('cashier@somalipos.com')}
                >
                  Amina (Cashier)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuickLogin('manager@somalipos.com')}
                >
                  Faisal (Manager)
                </Button>
              </div>
              <div className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
                Use 'password' as the password for all test accounts
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
