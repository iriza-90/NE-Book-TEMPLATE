
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-book-accent to-background p-4">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-4xl font-bold text-center text-book-secondary">Bookish</h1>
        <p className="text-center text-muted-foreground mt-2">A legit Library 😉</p>
      </div>
      
      {isLogin ? (
        <LoginForm onShowSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onShowLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
