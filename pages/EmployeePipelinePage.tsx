
import React from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { BriefcaseIcon, MapPinIcon } from '../components/icons';
import { cn } from '../lib/utils';
import Card from '../components/Card';

const stages = [
    "Lead", "Estimate", "Quote", "Sign", "Schedule",
    "Pre-Install", "Install", "Punch-list", "Invoicing", "Completed"
];

const EmployeePipelinePage: React.FC = () => {
    const { projects, setCurrentProjectId } = useMockDB();
    const { setActivePageId } = useNavigation();

    const handleCardClick = (id: string) => {
        setCurrentProjectId(id);
        setActivePageId('E-EST-TOOL'); // Default to estimator for analysis
    };

    const getProjectsForStage = (stageName: string) => {
        // Simple mapping from board stages to DB stages
        const stageMap: Record<string, string[]> = {
            "Lead": ["Lead"],
            "Estimate": ["Estimate"],
            "Quote": ["Quote"],
            "Sign": ["Sign & Verify"],
            "Schedule": ["Schedule"],
            "Pre-Install": ["Pre-Installation"],
            "Install": ["Install"],
            "Punch-list": ["Punch List"],
            "Invoicing": ["Invoicing"],
            "Completed": ["Completed"]
        };
        const targetStages = stageMap[stageName] || [stageName];
        return projects.filter(p => targetStages.includes(p.current_stage));
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />

            <header className="relative z-20 p-6 border-b border-gray-800 bg-black/60 backdrop-blur-md flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">Sales Pipeline Board</h1>
                    <p className="text-gray-400 text-xs mt-1">10-Stage Project Lifecycle Command Center</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Jobs</p>
                        <p className="text-xl font-bold text-[#ec028b] leading-none">{projects.length}</p>
                    </div>
                </div>
            </header>

            <main className="relative z-20 flex-1 flex overflow-x-auto overflow-y-hidden p-6 gap-6 scrollbar-hide">
                {stages.map((stage) => {
                    const stageProjects = getProjectsForStage(stage);
                    return (
                        <div key={stage} className="flex-none w-72 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-[#ec028b] mr-2 shadow-[0_0_8px_#ec028b]"></span>
                                    {stage}
                                </h3>
                                <span className="bg-gray-900 border border-gray-700 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                                    {stageProjects.length}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide pb-10">
                                {stageProjects.map((project) => (
                                    <Card
                                        key={project._id}
                                        className="mb-4 cursor-pointer hover:border-[#ec028b]/80 group relative overflow-hidden active:scale-95 transition-transform"
                                    >
                                        <div onClick={() => handleCardClick(project._id)}>
                                            {/* Activity Glow */}
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ec028b]/5 blur-2xl group-hover:bg-[#ec028b]/10 transition-colors pointer-events-none"></div>

                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-white font-bold text-sm truncate group-hover:text-[#ec028b] transition-colors">{project.name}</h4>
                                                <BriefcaseIcon className="w-3 h-3 text-gray-600 group-hover:text-[#ec028b]" />
                                            </div>

                                            <div className="flex items-center text-[10px] text-gray-500 mb-4">
                                                <MapPinIcon className="w-2.5 h-2.5 mr-1" />
                                                <span className="truncate">123 Street Address...</span>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                <div className="font-mono text-xs font-bold text-[#ec028b] shadow-sm">
                                                    {project.quote?.total ? `$${project.quote.total.toLocaleString()}` : '$—'}
                                                </div>
                                                <div className="text-[9px] text-gray-600 uppercase font-bold">
                                                    ID: {project._id.split('-').pop()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {stageProjects.length === 0 && (
                                    <div className="border border-dashed border-gray-800 rounded-xl p-8 text-center bg-black/20">
                                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest italic">Clear</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default EmployeePipelinePage;
