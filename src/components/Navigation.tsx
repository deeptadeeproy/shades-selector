import React from 'react';

interface NavigationProps {
  palette: any;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ palette }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: 'var(--text)' }}>
              Shadecard
            </h1>
          </div>
          
          {/* Right side - can be used for future navigation items */}
          <div className="flex items-center space-x-4">
            {/* Placeholder for future navigation items */}
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation'; 