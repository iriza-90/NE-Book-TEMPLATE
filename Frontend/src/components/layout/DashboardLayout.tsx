
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Book } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  
  const getInitials = (firstname: string) => {
    return firstname
      // .split(' ')
      // .map((n) => n[0])
      // .join('')
      // .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Book className="h-6 w-6 text-book-primary mr-2" />
            <h1 className="text-xl font-bold text-book-primary">Bookish</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="font-medium">{user.firstname}</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-book-primary text-white">
                    {getInitials(user.firstname)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Bookish - Book Management System
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
