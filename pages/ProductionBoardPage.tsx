
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { 
    CalendarDaysIcon, 
    TruckIcon, 
    WrenchIcon, 
    Check,
    MapPinIcon
} from '../components/icons';

const ProductionBoardPage: React.FC = () => {
    const { projects } = useMockDB();
    const [viewMode, setViewMode] = useState<'Board' | 'Calendar'>('Board');

    const productionProjects = projects.filter(p => 
        ['Schedule', 'Pre-Installation', 'Install', 'Punch List'].includes(p.current_stage)
    );

    const renderColumn = (stage: string, icon: any) => (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex-1 min-w-[320px] flex flex-col h-[calc(100vh-200px)]">
            <div className="flex items-center mb-4 text-white font-bold border-b border-gray-800 pb-3">
                <div className="p-2 bg-black border border-gray-700 rounded-lg mr-3 text-[#ec028b]">
                    {icon}
                </div>
                {stage}
                <span className="ml-auto bg-black border border-gray-700 text-xs px-2 py-1 rounded text-gray-400 font-mono">
                    {productionProjects.filter(p => p.current_stage === stage).length}
                </span>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                {productionProjects.filter(p => p.current_stage === stage).map(project => (
                    <div key={project._id} className="bg-black/40 p-4 rounded-lg border border-gray-700 hover:border-[#ec028b] cursor-grab active:cursor-grabbing shadow-sm group transition-all">
                        <h4 className="text-white font-bold text-sm group-hover:text-[#ec028b] transition-colors">{project.name}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                            <MapPinIcon className="w-3 h-3 mr-1" /> 123 Street Name...
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wide">ID: {project._id}</span>
                            <Button size="sm" variant="secondary" className="!py-1 !px-2 text-[10px] h-6 bg-gray-800 border-gray-700 text-gray-300 hover:text-white">Manage</Button>
                        </div>
                    </div>
                ))}
                {productionProjects.filter(p => p.current_stage === stage).length === 0 && (
                    <div className="text-center py-8 text-gray-600 text-xs italic border border-dashed border-gray-800 rounded-lg">
                        No active jobs
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <PageContainer 
            title="Production Board" 
            description="Logistics, Scheduling, and Installation Tracking."
            headerAction={
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
            }
        >
            {viewMode === 'Board' ? (
                <div className="flex gap-6 overflow-x-auto pb-6 h-full">
                    {renderColumn('Schedule', <CalendarDaysIcon className="w-5 h-5" />)}
                    {renderColumn('Pre-Installation', <TruckIcon className="w-5 h-5" />)}
                    {renderColumn('Install', <WrenchIcon className="w-5 h-5" />)}
                    {renderColumn('Punch List', <Check className="w-5 h-5" />)}
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
