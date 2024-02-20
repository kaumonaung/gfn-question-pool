import React from 'react';

const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
      {children}
    </main>
  );
};

export default PageContainer;
