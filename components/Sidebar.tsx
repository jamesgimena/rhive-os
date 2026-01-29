
import React from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { PAGE_GROUPS } from '../constants';
import { PageGroup } from '../types';
import { 
    RhiveLogo, 
    HomeIcon, 
    ChartBarIcon, 
    UserIcon, 
    CalendarDaysIcon, 
    MagnifyingGlassIcon, 
    CalculatorIcon, 
    PriceTagIcon, 
    DocumentTextIcon, 
    ListBulletIcon,
    BuildingStorefrontIcon,
    MapPinIcon,
    BriefcaseIcon,
    TruckIcon,
    WrenchIcon,
    BoltIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    SearchIcon,
    ClockIcon,
    KeyIcon
} from './icons';
import { cn } from '../lib/utils';

// Helper to get icon by page ID
const getIconForPage = (id: string) => {
    // PUBLIC
    if (id === 'P-01') return <UserIcon className="h-5 w-5" />;
    if (id === 'P-02') return <BuildingStorefrontIcon className="h-5 w-5" />;
    if (id === 'P-03') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'P-04') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'P-05') return <MapPinIcon className="h-5 w-5" />;
    if (id === 'P-07') return <KeyIcon className="h-5 w-5" />;
    if (id === 'P-09') return <BuildingStorefrontIcon className="h-5 w-5" />;
    if (id === 'P-10') return <BoltIcon className="h-5 w-5" />;
    if (id === 'P-11') return <DocumentTextIcon className="h-5 w-5" />;
    if (id === 'P-12') return <CalculatorIcon className="h-5 w-5" />;

    // ADMIN (A-Series)
    if (id.startsWith('A-')) return <ShieldCheckIcon className="h-5 w-5" />;

    // EMPLOYEE (E-Series)
    if (id === 'E-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'E-02') return <SearchIcon className="h-5 w-5" />;
    if (id === 'E-02a') return <UserIcon className="h-5 w-5" />;
    if (id === 'E-03') return <BoltIcon className="h-5 w-5" />;
    if (id === 'E-04' || id === 'E-22') return <CalendarDaysIcon className="h-5 w-5" />;
    if (id === 'E-05') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'E-06') return <MapPinIcon className="h-5 w-5" />;
    if (id === 'E-16') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (id === 'E-17') return <ChartBarIcon className="h-5 w-5" />;
    if (id === 'E-18') return <DocumentTextIcon className="h-5 w-5" />;
    if (id === 'E-23') return <PriceTagIcon className="h-5 w-5" />;
    if (id === 'E-27' || id === 'P-12') return <CalculatorIcon className="h-5 w-5" />;
    if (id === 'E-38') return <BoltIcon className="h-5 w-5" />;
    if (id === 'E-29') return <ShieldCheckIcon className="h-5 w-5" />;
    if (id === 'E-32') return <WrenchIcon className="h-5 w-5" />;
    if (id === 'E-34') return <CurrencyDollarIcon className="h-5 w-5" />;
    
    // CUSTOMER
    if (id === 'C-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'C-02') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'C-03') return <BriefcaseIcon className="h-5 w-5" />;
    if (id.startsWith('C-')) return <UserIcon className="h-5 w-5" />;
    
    // CONTRACTOR
    if (id === 'CO-01') return <HomeIcon className="h-5 w-5" />;
    if (id === 'CO-06') return <ListBulletIcon className="h-5 w-5" />;
    if (id === 'CO-08') return <MapPinIcon className="h-5 w-5" />;
    if (id.startsWith('CO-')) return <BuildingStorefrontIcon className="h-5 w-5" />;
    
    // SUPPLIER
    if (id === 'S-04') return <UserIcon className="h-5 w-5" />;
    if (id.startsWith('S-')) return <TruckIcon className="h-5 w-5" />;

    return <BriefcaseIcon className="h-5 w-5" />;
};

interface SidebarProps {
    pageGroups?: PageGroup[];
}

export const Sidebar: React.FC<SidebarProps> = ({ pageGroups }) => {
    const { currentUser, logout } = useMockDB();
    const { activePageId, setActivePageId } = useNavigation();

    if (!currentUser) return null;

    // Filter groups based on user role
    const sourceGroups = pageGroups || PAGE_GROUPS;
    const userGroups = sourceGroups.filter(group => 
        group.userType === 'All' || group.userType === currentUser.role
    );

    return (
        <aside className="w-64 bg-black/80 border-r border-gray-800 backdrop-blur-md flex flex-col flex-shrink-0 h-full relative z-50">
            <div className="p-6 border-b border-gray-800 flex items-center justify-center">
                <RhiveLogo className="h-8" />
            </div>

            <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                {userGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-6 px-4">
                        <div className="space-y-1">
                            {group.pages.map(page => (
                                <button
                                    key={page.id}
                                    onClick={() => setActivePageId(page.id)}
                                    className={cn(
                                        "flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        activePageId === page.id
                                            ? "bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/30"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    <span className="mr-3 opacity-80">
                                        {getIconForPage(page.id)}
                                    </span>
                                    <span className="truncate">{page.name}</span>
                                </button>
                            ))}
                        </div>
                        {groupIdx < userGroups.length - 1 && (
                            <div className="my-4 border-t border-gray-800/50 mx-2" />
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-800 bg-black/40">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs border border-gray-600">
                        {currentUser.name.charAt(0)}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-[#ec028b] truncate">{currentUser.role}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full py-2 px-4 bg-gray-900 hover:bg-red-900/20 border border-gray-700 hover:border-red-500/50 rounded-lg text-gray-400 hover:text-red-400 text-sm transition-all"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
