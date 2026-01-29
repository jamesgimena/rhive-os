
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Button from '../components/Button';
import {
    MagnifyingGlassIcon,
    UserIcon,
    MapPinIcon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    Check,
    BoltIcon,
    ArrowRightIcon,
    XIcon,
    PlusIcon
} from '../components/icons';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { cn } from '../lib/utils';

const GlobalNavCustomerLookup: React.FC = () => {
    const { users, projects, properties, setCurrentProjectId, createProject, addProperty, addCommunication } = useMockDB();
    const { setActivePageId } = useNavigation();
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [filteredResults, setFilteredResults] = useState<any>(null);

    // Modal State
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>({});

    useEffect(() => {
        if (query.length > 0) {
            setHasSearched(true);
            const lowerQ = query.toLowerCase();
            
            setFilteredResults({
                customers: users.filter(u => u.name.toLowerCase().includes(lowerQ) || u.role.toLowerCase().includes(lowerQ)),
                projects: projects.filter(p => p.name.toLowerCase().includes(lowerQ) || p._id.toLowerCase().includes(lowerQ)),
                properties: properties.filter(p => p.address_full.toLowerCase().includes(lowerQ)),
            });
        } else {
            setHasSearched(false);
            setFilteredResults(null);
        }
    }, [query, users, projects, properties]);

    const handleProjectClick = (projectId: string) => {
        setCurrentProjectId(projectId);
        setActivePageId('E-EST-TOOL');
    };

    const handleProfileClick = (user: any) => {
        if (user.role === 'Employee') setActivePageId('E-21');
        else if (user.role === 'Contractor') setActivePageId('E-25');
        else if (user.role === 'Customer') setActivePageId('C-03');
        else setActivePageId('E-08'); 
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Modal Layer */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <Card className="w-full max-w-lg relative border-rhive-pink/50 shadow-pink-glow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-rhive-pink">QOS Data Injection</CardTitle>
                            <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white"><XIcon className="w-6 h-6" /></button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeModal === 'project' && (
                                <>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Initialize New Project Node</p>
                                    <input type="text" placeholder="Project Name" className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-rhive-pink outline-none" onChange={e => setModalData({...modalData, name: e.target.value})} />
                                    <select className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-rhive-pink outline-none" onChange={e => setModalData({...modalData, property: e.target.value})}>
                                        <option value="">Link to Property Node...</option>
                                        {properties.map(p => <option key={p._id} value={p._id}>{p.address_full}</option>)}
                                    </select>
                                    <Button onClick={() => { createProject(modalData.name, 'Residential', modalData.property, 'U-NEW'); setActiveModal(null); }} className="w-full">Initialize</Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            <PageContainer title="Dispatch & Search" description="Global QOS node lookup. Access any customer, property, or project record instantly.">
                
                {/* Search HUD */}
                <div className="flex flex-col items-center justify-center mb-12 sticky top-0 z-40 py-4 -mt-4">
                    <div className="w-full max-w-4xl relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                            <MagnifyingGlassIcon className={cn("h-6 w-6 transition-all duration-500", hasSearched ? 'text-rhive-pink drop-shadow-[0_0_8px_#ec028b]' : 'text-gray-600')} />
                        </div>
                        <div 
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl z-0"
                            style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                        />
                        <input
                            type="text"
                            className="block w-full pl-16 pr-6 py-6 bg-transparent border border-gray-800 focus:border-rhive-pink rounded-none leading-5 text-white placeholder-gray-600 focus:outline-none focus:ring-0 transition-all duration-300 text-xl relative z-10 font-sans tracking-tight"
                            placeholder="Search Nodes (e.g., 'Michael', 'Hangar 42', 'Thompson')..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
                        />
                        {/* Interactive border glow for search input */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible opacity-30 group-focus-within:opacity-100 transition-opacity">
                            <path d="M 20 0 L 0 20 M calc(100% - 20px) 100% L 100% calc(100% - 20px)" stroke="#ec028b" strokeWidth="2" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 max-w-6xl mx-auto pb-32">
                    
                    {/* PEOPLE NODES */}
                    <Card className="overflow-visible border-gray-800/40">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/50 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rhive-pink/10 rounded-lg">
                                    <UserIcon className="w-5 h-5 text-rhive-pink" />
                                </div>
                                <CardTitle className="text-sm tracking-[0.2em]">People & Entities</CardTitle>
                            </div>
                            <Button size="sm" variant="secondary" className="h-8 text-[10px]" onClick={() => setActivePageId('E-02a')}>
                                <PlusIcon className="w-3 h-3 mr-1" /> New Node
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {(filteredResults ? filteredResults.customers : users).map((user: any) => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => handleProfileClick(user)}
                                        className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                        <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                            {user.role === 'Contractor' || user.role === 'Supplier' ? <BuildingStorefrontIcon className="h-6 w-6"/> : <UserIcon className="h-6 w-6" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">{user.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span className="uppercase tracking-widest">{user.role}</span>
                                                <span className="opacity-30">•</span>
                                                <span className="font-mono">{user.email}</span>
                                            </div>
                                        </div>
                                        <ArrowRightIcon className="w-5 h-5 text-gray-700 group-hover:text-rhive-pink group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* PROJECT NODES */}
                    <Card className="overflow-visible border-gray-800/40">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/50 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rhive-pink/10 rounded-lg">
                                    <BriefcaseIcon className="w-5 h-5 text-rhive-pink" />
                                </div>
                                <CardTitle className="text-sm tracking-[0.2em]">Active Projects</CardTitle>
                            </div>
                            <Button size="sm" variant="secondary" className="h-8 text-[10px]" onClick={() => setActiveModal('project')}>
                                <PlusIcon className="w-3 h-3 mr-1" /> Start New
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {(filteredResults ? filteredResults.projects : projects).map((proj: any) => (
                                    <div 
                                        key={proj._id} 
                                        onClick={() => handleProjectClick(proj._id)}
                                        className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                        <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                            <BriefcaseIcon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">{proj.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span className="text-rhive-pink font-black uppercase italic tracking-tighter">Stage: {proj.current_stage}</span>
                                                <span className="opacity-30">•</span>
                                                <span className="font-mono">{proj.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:block text-right">
                                                <p className="text-[10px] text-gray-600 font-bold uppercase">Estimated Val</p>
                                                <p className="text-white font-mono font-bold">{proj.quote?.total ? `$${proj.quote.total.toLocaleString()}` : '$—'}</p>
                                            </div>
                                            <button className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 group-hover:border-rhive-pink group-hover:text-rhive-pink transition-all">
                                                <BoltIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* PROPERTY NODES */}
                    <Card className="overflow-visible border-gray-800/40">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800/50 bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rhive-pink/10 rounded-lg">
                                    <MapPinIcon className="w-5 h-5 text-rhive-pink" />
                                </div>
                                <CardTitle className="text-sm tracking-[0.2em]">Properties & Sites</CardTitle>
                            </div>
                            <Button size="sm" variant="secondary" className="h-8 text-[10px]">
                                <PlusIcon className="w-3 h-3 mr-1" /> Add Site
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-800/30">
                                {(filteredResults ? filteredResults.properties : properties).map((prop: any) => (
                                    <div 
                                        key={prop._id} 
                                        className="flex items-center p-5 hover:bg-rhive-pink/5 transition-all cursor-pointer group relative overflow-hidden"
                                        onClick={() => setActivePageId('E-12')}
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rhive-pink scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                        <div className="h-12 w-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink mr-5 shrink-0 group-hover:border-rhive-pink/50 group-hover:shadow-pink-glow-sm transition-all">
                                            <MapPinIcon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-white group-hover:text-rhive-pink transition-colors truncate">{prop.address_full}</h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span className="uppercase tracking-widest">{prop.type}</span>
                                                <span className="opacity-30">•</span>
                                                <span className="font-mono text-[10px]">COORDS: {prop.coordinates.lat.toFixed(2)}, {prop.coordinates.lng.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {prop.features.map((f: string) => (
                                                <span key={f} className="text-[8px] bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-500 uppercase font-black">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </PageContainer>
        </div>
    );
};

export default GlobalNavCustomerLookup;
