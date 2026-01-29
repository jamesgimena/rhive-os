
import React from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';
import { RhiveLogo } from '../components/icons';

interface ItemCardProps {
    title: string;
    id: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ title, id }) => (
    <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 hover:border-[#ec028b]/50 transition-colors cursor-pointer">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-xs text-gray-400 font-mono">{id}</p>
    </div>
);

const LineItemCatalogPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-07');

     const projects = [
        { id: 1, name: '1927 Thompson', active: true },
        { id: 2, name: '456 Oak Ave', active: false },
        { id: 3, name: '789 Pine St', active: false },
    ];

    const topTabs = ['Asphalt', 'Flat Roofing', 'Gutters', 'Heat Trace', 'Chimney Repoint', 'Overhead'];

    return (
         <div className="flex h-full text-gray-200">
            {/* Left Sidebar */}
            <aside className="w-64 bg-black/60 flex-shrink-0 p-4 border-r border-gray-800 backdrop-blur-md">
                <div className="flex items-center mb-6">
                     <RhiveLogo className="h-8 w-auto mr-3" />
                     <h2 className="text-xl font-bold text-white">Quotes</h2>
                </div>
                <nav className="space-y-2">
                    <a href="#" className="flex items-center p-3 hover:bg-gray-800 rounded-lg text-sm text-gray-300">
                        Quotes
                    </a>
                    <a href="#" className="flex items-center p-3 bg-[#ec028b]/20 text-[#ec028b] rounded-lg text-sm font-semibold">
                        Item Catalog
                    </a>
                    <p className="text-xs text-gray-400 font-semibold uppercase px-3 pt-4">Projects</p>
                    {projects.map(p => (
                        <a href="#" key={p.id} className={`block p-3 rounded-lg text-sm transition-colors ${p.active ? 'bg-gray-800/60' : 'hover:bg-gray-800/40'}`}>
                            <p className="font-bold">{p.name}</p>
                        </a>
                    ))}
                </nav>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Item Catalog</h1>
                    </div>
                     <div className="flex space-x-1">
                        {topTabs.map((tab, index) => (
                             <Button key={tab} variant={index === 0 ? 'primary' : 'secondary'} size="sm" className="!rounded-full">
                                {tab}
                            </Button>
                        ))}
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <CollapsibleSection title="Input Questions">
                        <CollapsibleSection title="Misc Expenses" contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                           <ItemCard title="Additional Material cost" id="ASPH-MAT-ADD$" />
                           <ItemCard title="Additional Labor cost" id="ASPH-LAB-ADD$" />
                           <ItemCard title="Additional Overhead cost" id="ASPH-OVH-ADD$" />
                           <ItemCard title="Additional Profit amount" id="ASPH-PROFIT-ADD$" />
                           <ItemCard title="Trips w/ a trailer (Sub)" id="ASPH-TRAILER-TRIPS-SUB" />
                           <ItemCard title="Trips w/ trailer (Dub)" id="ASPH-TRAILER-TRIPS-DUB" />
                           <ItemCard title="Supplier Trips / Pick-up" id="ASPH-SUPPLIER-TRIPS" />
                           <ItemCard title="Additional Trips (PM)" id="ASPH-TRIPS-PM" />
                        </CollapsibleSection>
                        {['Measurements', 'Flashing & Pipejacks', 'Ventilation', 'Tear Off / Removal', 'Installation', 'Decking', 'Swamp Cooler', 'Skylight', 'Satellite', 'Chimney'].map(title => (
                            <CollapsibleSection key={title} title={title}>
                                <p className="text-gray-500 p-4">Content for {title} goes here.</p>
                            </CollapsibleSection>
                        ))}
                    </CollapsibleSection>

                    <h3 className="text-xl font-bold text-[#ec028b] pt-4 border-t border-gray-800">Asphalt Calculations</h3>
                     {['Material', 'Labor'].map(title => (
                        <CollapsibleSection key={title} title={title}>
                            <p className="text-gray-500 p-4">Content for {title} goes here.</p>
                        </CollapsibleSection>
                    ))}
                    
                    <h3 className="text-xl font-bold text-[#ec028b] pt-4 border-t border-gray-800">Upgrade Options</h3>
                     <CollapsibleSection title="Upgrade Options" contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                           <ItemCard title="Valley Metal Upgrade" id="ASPH-UPG-VALLEY-METAL" />
                           <ItemCard title="High Profile Hip & Ridge Cap" id="ASPH-UPG-HIGH-PROF-H&R-LF" />
                           <ItemCard title="Flex Shingle Upgrade" id="ASPH-UPG-FLEX-SHINGLE" />
                           <ItemCard title="Woodcrest Shingle Upgrade" id="ASPH-UPG-WOODCREST" />
                           <ItemCard title="Woodmoor Shingle Upgrade" id="ASPH-UPG-WOODMOOR" />
                    </CollapsibleSection>
                </div>
            </main>
        </div>
    );
};

export default LineItemCatalogPage;
