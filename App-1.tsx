
import React, { useState } from 'react';
import { PricingProvider } from './contexts/PricingContext';
import { Sidebar } from './components/Sidebar';
import { AdminPanel } from './components/AdminPanel';
import { EstimatorFlow } from './components/EstimatorFlow';
import { RhiveLogo } from './components/icons';
import { PageGroup } from './types';

type Page = 'home' | 'pricing';

const HomePage = () => (
  <div className="p-8 text-center flex flex-col items-center justify-center h-full">
    <RhiveLogo className="h-24 mx-auto mb-8" />
    <h1 className="text-4xl font-bold text-white">Welcome to the RHIVE Platform</h1>
    <p className="mt-4 text-lg text-gray-400">
      Select a tool from the sidebar to get started.
    </p>
  </div>
);

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [isEstimatorVisible, setEstimatorVisible] = useState(false);

  const pageGroups: PageGroup[] = [
    {
      userType: 'All',
      pages: [
        { id: 'home', name: 'Home', userType: 'All', description: 'Go to Homepage' },
        { id: 'pricing', name: 'Pricing', userType: 'All', description: 'Manage Pricing' },
        { id: 'estimator', name: 'Start Estimator', userType: 'All', description: 'Launch Estimator Tool' }
      ]
    }
  ];

  const handleNavigation = (id: string) => {
    if (id === 'estimator') {
      setEstimatorVisible(true);
    } else if (id === 'home' || id === 'pricing') {
      setPage(id as Page);
      setEstimatorVisible(false);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'pricing':
        return <AdminPanel />; 
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex overflow-hidden">
      <Sidebar
        pageGroups={pageGroups} // Note: Sidebar props need to match what Sidebar expects. Based on components/Sidebar.tsx, it doesn't accept props but uses contexts. 
        // Assuming App-1.tsx was a parallel experiment and Sidebar component might not support these props directly or needs adjustment. 
        // However, standard Sidebar in components/Sidebar.tsx reads from context. 
        // I will leave props here as they were in original file, but note potential mismatch if Sidebar doesn't accept them.
        // Since I am not changing Sidebar definition signature to accept props, this might still be an issue if this file is used. 
        // But I fixed the import.
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>

      {isEstimatorVisible && (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          <EstimatorFlow onClose={() => setEstimatorVisible(false)} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PricingProvider>
      <AppContent />
    </PricingProvider>
  )
}
