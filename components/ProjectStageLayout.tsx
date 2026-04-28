import React from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';

interface ProjectStageLayoutProps {
    stageLabel: string;
    stagePageId: string;
    children: (project: any) => React.ReactNode;
}

export const ProjectStageLayout: React.FC<ProjectStageLayoutProps> = ({ stageLabel, stagePageId, children }) => {
    const { getProject, currentProjectId } = useMockDB();
    
    // Fallback to the first project if none is selected, to ensure UI is visible for presentation
    const { projects } = useMockDB();
    const project = currentProjectId ? getProject(currentProjectId) : (projects.length > 0 ? projects[0] : null);

    if (!project) {
        return (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold mb-2">No Project Found</h2>
                <p>Please ensure there is an active project or select one from the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-black relative">
            <header className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/30 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-black text-white italic tracking-wider uppercase">
                        {stageLabel}
                    </h1>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/30">
                        {stagePageId}
                    </span>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-300">{project.name}</p>
                    <p className="text-xs text-gray-500">ID: {project._id}</p>
                </div>
            </header>
            
            <main className="flex-1 overflow-auto relative">
                {/* Subtle gradient background specific to stages */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ec028b]/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                    {children(project)}
                </div>
            </main>
        </div>
    );
};
