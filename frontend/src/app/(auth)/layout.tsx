import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white/90">
      {children}
    </div>
  );
};

export default AuthLayout;
