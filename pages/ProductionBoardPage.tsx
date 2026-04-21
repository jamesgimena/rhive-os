
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
    CalendarDaysIcon, 
    TruckIcon, 
    WrenchIcon, 
    Check,
    MapPinIcon
} from '../components/icons';
import { projectService } from '../lib/firebaseService';
import { cn } from '../lib/utils';

// The 4 production stages this board tracks
const PRODUCTION_STAGES: { label: string; icon: React.ReactNode; match: string[] }[] = [
    { label: 'Schedule',         icon: <CalendarDaysIcon className="w-5 h-5" />, match: ['schedule'] },
    { label: 'Pre-Installation', icon: <TruckIcon className="w-5 h-5" />,        match: ['pre-installation', 'pre-install'] },
    { label: 'Install',          icon: <WrenchIcon className="w-5 h-5" />,       match: ['install'] },
    { label: 'Punch List',       icon: <Check className="w-5 h-5" />,            match: ['punch list', 'punch-list'] },
];

const ProductionBoardPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'Board' | 'Calendar'>('Board');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Firebase real-time project data
    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getProjectsForStage = (stageConfig: typeof PRODUCTION_STAGES[number]) => {
        return projects.filter(p => {
            const cs = (p.current_stage || '').toLowerCase().trim();
            return stageConfig.match.some(m => cs === m || cs.startsWith(m));
        });
    };

    const getAddress = (p: any): string => {
        if (p.property?.address) {
            return [p.property.address, p.property.city].filter(Boolean).join(', ');
        }
        return p.property_address || 'Address not set';
    };

    const renderColumn = (stageConfig: typeof PRODUCTION_STAGES[number]) => {
        const stageProjects = getProjectsForStage(stageConfig);
        return (
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex-1 min-w-[300px] flex flex-col h-[calc(100vh-200px)]">
                <div className="flex items-center mb-4 text-white font-bold border-b border-gray-800 pb-3">
                    <div className="p-2 bg-black border border-gray-700 rounded-lg mr-3 text-[#ec028b]">
                        {stageConfig.icon}
                    </div>
                    {stageConfig.label}
                    <span className="ml-auto bg-black border border-gray-700 text-xs px-2 py-1 rounded text-gray-400 font-mono">
                        {loading ? '…' : stageProjects.length}
                    </span>
                </div>
                <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-1">
                    {loading ? (
                        <div className="space-y-3 animate-pulse">
                            {[0, 1].map(i => (
                                <div key={i} className="h-20 bg-gray-900 border border-gray-800 rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        stageProjects.map(project => (
                            <div
                                key={project.id}
                                className="bg-black/40 p-4 rounded-lg border border-gray-700 hover:border-[#ec028b] cursor-grab active:cursor-grabbing shadow-sm group transition-all"
                            >
                                <h4 className="text-white font-bold text-sm group-hover:text-[#ec028b] transition-colors">
                                    {project.name || 'Unnamed Project'}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                    <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                                    <span className="truncate">{getAddress(project)}</span>
                                </div>
                                {project.project_type && (
                                    <span className="inline-block mt-2 text-[9px] bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-gray-500 uppercase font-black">
                                        {project.project_type}
                                    </span>
                                )}
                                <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wide">
                                        {project.id.slice(-8)}
                                    </span>
                                    <Button size="sm" variant="secondary" className="!py-1 !px-2 text-[10px] h-6 bg-gray-800 border-gray-700 text-gray-300 hover:text-white">
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                    {!loading && stageProjects.length === 0 && (
                        <div className="text-center py-8 text-gray-600 text-xs italic border border-dashed border-gray-800 rounded-lg">
                            No active jobs
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <PageContainer 
            title="Production Board" 
            description="Logistics, Scheduling, and Installation Tracking — live from Firebase."
            headerAction={
                <div className="flex items-center gap-4">
                    {/* Live indicator */}
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",
                        loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                    )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400 shadow-[0_0_8px_#4ade80]")} />
                        {loading ? 'Syncing…' : 'Live'}
                    </div>
                    <div className="flex bg-black border border-gray-800 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('Board')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'Board' ? 'bg-gray-800 text-[#ec028b]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Board
                        </button>
                        <button 
                            onClick={() => setViewMode('Calendar')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'Calendar' ? 'bg-gray-800 text-[#ec028b]' : 'text-gray-500 hover:text-white'}`}
                        >
                            Calendar
                        </button>
                    </div>
                </div>
            }
        >
            {viewMode === 'Board' ? (
                <div className="flex gap-6 overflow-x-auto pb-6 h-full">
                    {PRODUCTION_STAGES.map(stage => (
                        <React.Fragment key={stage.label}>
                            {renderColumn(stage)}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <Card className="h-[600px] flex items-center justify-center bg-gray-900/30 border-gray-800">
                    <div className="text-center text-gray-600">
                        <CalendarDaysIcon className="w-20 h-20 mx-auto mb-6 opacity-20" />
                        <p className="text-lg font-medium">Calendar Integration Placeholder</p>
                        <p className="text-sm mt-2">Syncs with Google/Outlook/Zoho</p>
                    </div>
                </Card>
            )}
        </PageContainer>
    );
};

export default ProductionBoardPage;
