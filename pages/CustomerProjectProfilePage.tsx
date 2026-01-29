
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
    Check, 
    CameraIcon, 
    DocumentTextIcon, 
    ShieldCheckIcon,
    ArrowRightIcon,
    BoltIcon,
    ClockIcon,
    BriefcaseIcon,
    MapPinIcon
} from '../components/icons';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { cn } from '../lib/utils';

const CustomerProjectProfilePage: React.FC = () => {
    const { currentUser, getUserProjects } = useMockDB();
    const projects = currentUser ? getUserProjects(currentUser.id) : [];
    const activeProject = projects[0] || {
        _id: 'PROJ-DEMO',
        name: 'Thompson Residence Roof Restoration',
        current_stage: 'Install',
        status: 'Active'
    };

    const stages = [
        { name: 'Lead', status: 'completed' },
        { name: 'Estimate', status: 'completed' },
        { name: 'Quote', status: 'completed' },
        { name: 'Sign & Verify', status: 'completed' },
        { name: 'Schedule', status: 'completed' },
        { name: 'Install', status: 'active' },
        { name: 'Punch List', status: 'pending' },
        { name: 'Completion', status: 'pending' }
    ];

    const feedItems = [
        { time: '10:42 AM', type: 'photo', label: 'Tear-off Progress - West Slope', img: 'https://picsum.photos/seed/roof1/400/300' },
        { time: '09:15 AM', type: 'status', label: 'Crew Arrived & Safety Setup Complete', icon: ShieldCheckIcon },
        { time: 'Yesterday', type: 'doc', label: 'Material Delivery Confirmation', icon: DocumentTextIcon }
    ];

    return (
        <PageContainer 
            title={activeProject.name} 
            description="Real-time project tracking and transparency core."
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Progress Logic */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* Pizza Tracker View */}
                    <Card className="p-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Project Progress</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">10-Stage Quantum OS Tracking</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Stage</span>
                                <p className="text-rhive-pink font-black text-xl uppercase italic">"{activeProject.current_stage}"</p>
                            </div>
                        </div>

                        <div className="relative flex flex-col md:flex-row justify-between gap-4">
                            {/* Connector Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-800 hidden md:block z-0" />
                            
                            {stages.map((s, i) => (
                                <div key={i} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 group">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                                        s.status === 'completed' ? "bg-green-500/20 border-green-500 text-green-500" :
                                        s.status === 'active' ? "bg-rhive-pink border-rhive-pink text-white shadow-pink-glow animate-pulse" :
                                        "bg-black border-gray-700 text-gray-600"
                                    )}>
                                        {s.status === 'completed' ? <Check className="w-5 h-5" /> : <span className="text-xs font-black">{i + 1}</span>}
                                    </div>
                                    <div className="text-left md:text-center">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter whitespace-nowrap",
                                            s.status === 'pending' ? "text-gray-600" : "text-white"
                                        )}>{s.name}</p>
                                        {s.status === 'active' && <span className="text-[8px] text-rhive-pink font-bold uppercase tracking-widest hidden md:block">LIVE NOW</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Live Feed / Photo Gallery */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight flex items-center">
                                <CameraIcon className="w-5 h-5 mr-2 text-rhive-pink" />
                                Project Live Feed
                            </h3>
                            <Button variant="ghost" size="sm" className="text-[10px]">View All Documentation</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedItems.map((item, i) => (
                                <Card key={i} className="overflow-hidden group">
                                    {item.img ? (
                                        <div className="aspect-video relative">
                                            <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Job photo" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                            <div className="absolute bottom-3 left-4">
                                                <p className="text-white font-bold text-sm">{item.label}</p>
                                                <p className="text-gray-400 text-[10px] uppercase font-mono">{item.time}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-rhive-pink">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{item.label}</p>
                                                <p className="text-gray-500 text-[10px] uppercase font-mono">{item.time}</p>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <Card title="Job Specs">
                        <div className="space-y-4 p-2">
                            <div className="flex items-center gap-3">
                                <MapPinIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-300">1927 Thompson St, Boulder</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-300">Residental Replacement</span>
                            </div>
                            <div className="pt-4 border-t border-gray-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Shingle</span>
                                    <span className="text-xs text-white">Duration® Onyx Black</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">Warranty</span>
                                    <span className="text-xs text-green-400 font-bold">Lifetime No-Leak</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Actions">
                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start text-[10px]">
                                <BoltIcon className="w-4 h-4 mr-2" /> Message Project Lead
                            </Button>
                            <Button variant="secondary" className="w-full justify-start text-[10px]">
                                <DocumentTextIcon className="w-4 h-4 mr-2" /> View Signed Contract
                            </Button>
                            <Button variant="secondary" className="w-full justify-start text-[10px]">
                                <ShieldCheckIcon className="w-4 h-4 mr-2" /> Compliance Documents
                            </Button>
                        </div>
                    </Card>

                    <div className="bg-rhive-pink/10 border border-rhive-pink/30 p-6 rounded-3xl text-center shadow-pink-glow-sm">
                        <ClockIcon className="w-8 h-8 text-rhive-pink mx-auto mb-3" />
                        <h4 className="text-white font-black uppercase text-sm mb-1 tracking-tighter">Est. Completion</h4>
                        <p className="text-rhive-pink font-black text-xl">OCT 14, 2025</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-2 italic">Pending Weather Integrity</p>
                    </div>
                </div>

            </div>
        </PageContainer>
    );
};

export default CustomerProjectProfilePage;
