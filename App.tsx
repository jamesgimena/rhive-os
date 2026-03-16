
import React, { useEffect } from 'react';
import { PricingProvider } from './contexts/PricingContext';
import { MockDatabaseProvider, useMockDB } from './contexts/MockDatabaseContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { Sidebar } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import { pageComponentMap } from './pageRegistry';
import { CircuitryBackground } from './components/CircuitryBackground';
import { RhiveLogo } from './components/icons';

const AppContentAuthenticated: React.FC = () => {
    const { activePageId, setActivePageId } = useNavigation();
    const { currentUser } = useMockDB();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const pageCode = params.get('page');
        if (pageCode && pageCode !== activePageId) {
            setActivePageId(pageCode);
        }
    }, [activePageId, setActivePageId]);

    useEffect(() => {
        if (currentUser && !activePageId) {
            switch (currentUser.role) {
                case 'Super Admin': setActivePageId('SA-01'); break;
                case 'Admin': setActivePageId('E-01'); break; // Unified entry point
                case 'Employee': setActivePageId('E-01'); break;
                case 'Customer': setActivePageId('C-01'); break;
                case 'Contractor': setActivePageId('CO-01'); break;
                case 'Supplier': setActivePageId('S-01'); break;
                case 'Public': setActivePageId('P-01'); break;
            }
        }
    }, [currentUser, setActivePageId, activePageId]);

    const CurrentPage = pageComponentMap[activePageId] || (() => <div className="p-10 text-gray-400">Select a page from the menu.</div>);

    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden relative font-sans">
            <CircuitryBackground />

            <header className="fixed top-0 left-0 w-full h-12 bg-black/40 backdrop-blur-xl border-b border-gray-800 z-[100] flex items-center justify-between px-6 select-none">
                <div className="flex items-center gap-4">
                    <RhiveLogo className="h-6" />
                    <div className="h-4 w-[1px] bg-gray-700" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Quantum Operating System 1.2.5</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-green-500/80 uppercase tracking-widest">System Link Active</span>
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex h-full w-full pt-12">
                <Sidebar />
                <main className="flex-1 h-full overflow-hidden bg-black/20 relative border-l border-gray-800/50">
                    <CurrentPage />
                </main>
            </div>
        </div>
    );
};

const LoginBridge: React.FC = () => {
    const { currentUser, login } = useMockDB();

    if (!currentUser) {
        return (
            <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
                <CircuitryBackground />
                <div className="relative z-10 h-full">
                    <LoginPage onLogin={login} />
                </div>
            </div>
        );
    }

    return <AppContentAuthenticated />;
};

export default function App() {
    return (
        <MockDatabaseProvider>
            <PricingProvider>
                <NavigationProvider>
                    <LoginBridge />
                </NavigationProvider>
            </PricingProvider>
        </MockDatabaseProvider>
    );
}
