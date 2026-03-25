
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { Check, ClockIcon, CameraIcon, Layers as PackageIcon, WrenchIcon } from '../components/icons';
import { cn } from '../lib/utils';
import { projectService } from '../lib/firebaseService';

const STAGES = [
    { id: 'lead',             name: 'Intake' },
    { id: 'estimate',         name: 'Analysis' },
    { id: 'quote',            name: 'Certified Quote' },
    { id: 'sign & verify',    name: 'Signed' },
    { id: 'schedule',         name: 'Logisticized' },
    { id: 'pre-installation', name: 'Staging' },
    { id: 'install',          name: 'Execution' },
    { id: 'punch list',       name: 'Validation' },
    { id: 'invoicing',        name: 'Final Step' },
    { id: 'completed',        name: 'Certified' },
];

const CustomerTrackerPage: React.FC = () => {
    const { currentProjectId } = useMockDB();
    const [firebaseProjects, setFirebaseProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to Firebase real-time project updates
    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setFirebaseProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Resolve current project: prefer the MockDB selected project ID, then newest Firebase project
    const currentProject = firebaseProjects.length > 0
        ? (firebaseProjects.find(p => p.id === currentProjectId) || firebaseProjects[0])
        : null;

    const rawStage = (currentProject?.current_stage || 'lead').toLowerCase().trim();
    const currentStageIndex = STAGES.findIndex(s => s.id === rawStage);

    const addressDisplay = currentProject
        ? [currentProject.property_address || currentProject?.property?.address, currentProject?.property?.city, currentProject?.property?.state]
            .filter(Boolean).join(', ')
        : '';

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />

            <main className="relative z-20 flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                <div className="w-full max-w-5xl space-y-12">

                    {/* Project Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-800 pb-8">
                        <div>
                            <p className="text-[#ec028b] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Live Progress Tracker</p>
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-10 w-64 bg-gray-900 rounded mb-2" />
                                    <div className="h-4 w-48 bg-gray-900 rounded" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                        {currentProject?.name || 'Your Project'}
                                    </h1>
                                    <p className="text-gray-500 font-mono text-sm mt-2">{addressDisplay}</p>
                                </>
                            )}
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 px-6 py-4 flex items-center gap-4"
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                            <div className="h-3 w-3 rounded-full bg-[#ec028b] animate-pulse shadow-[0_0_10px_#ec028b]" />
                            <div>
                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Current Node</p>
                                <p className="text-white font-bold uppercase">
                                    {currentStageIndex >= 0 ? STAGES[currentStageIndex].name : 'Initializing'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pipeline Progress Tracker */}
                    <div className="relative grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {STAGES.map((stage, idx) => {
                            const isCompleted = idx < currentStageIndex;
                            const isActive = idx === currentStageIndex;

                            return (
                                <div key={stage.id} className="relative flex flex-col items-center group">
                                    {/* Connection line */}
                                    {idx < STAGES.length - 1 && (
                                        <div className="hidden lg:block absolute top-5 left-[50%] w-full h-[2px] bg-gray-800 -z-10">
                                            <div className={cn('h-full bg-[#ec028b] transition-all duration-1000', isCompleted ? 'w-full' : 'w-0')} />
                                        </div>
                                    )}

                                    {/* Stage bubble */}
                                    <div className={cn(
                                        'w-10 h-10 border-2 flex items-center justify-center transition-all duration-500',
                                        isCompleted
                                            ? 'bg-[#ec028b] border-[#ec028b] text-white shadow-[0_0_15px_rgba(236,2,139,0.3)]'
                                            : isActive
                                                ? 'bg-black border-[#ec028b] text-[#ec028b] shadow-[0_0_20px_rgba(236,2,139,0.5)] animate-pulse'
                                                : 'bg-gray-950 border-gray-800 text-gray-700'
                                    )} style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                    </div>

                                    <p className={cn(
                                        'mt-3 text-[9px] font-black uppercase tracking-tighter text-center',
                                        isActive ? 'text-[#ec028b]' : 'text-gray-500'
                                    )}>
                                        {stage.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stage Details Card */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="md:col-span-2" title="Project Update Feed">
                            <div className="space-y-6">
                                <div className="flex gap-4 border-l-2 border-[#ec028b] pl-6 py-2">
                                    <div className="shrink-0 w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-[#ec028b]"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                        <CameraIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">
                                            Project {currentProject?.current_stage ? `moved to ${currentProject.current_stage}` : 'submitted'}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {currentProject?.name || 'Your project'} has been entered into the RHIVE OS pipeline.
                                        </p>
                                        <p className="text-[#ec028b] text-[10px] uppercase font-black mt-2">
                                            {currentProject?.updated_at
                                                ? new Date(currentProject.updated_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                : currentProject?.created_at
                                                    ? new Date(currentProject.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                                    : 'Recently'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 border-l-2 border-gray-800 pl-6 py-2 opacity-50">
                                    <div className="shrink-0 w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                        <PackageIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Material Logistic Scheduling</p>
                                        <p className="text-gray-500 text-xs mt-1">Pending contract signature and initial verification.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <Card title="Quick Actions">
                                <div className="space-y-3">
                                    <button className="w-full py-3 bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                        Call Michael Direct
                                    </button>
                                    <button className="w-full py-3 bg-black border border-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-gray-500 transition-all"
                                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                        Message Support
                                    </button>
                                </div>
                            </Card>

                            <div className="bg-[#ec028b]/5 border border-[#ec028b]/20 p-6 space-y-4"
                                style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                                <div className="flex items-center gap-3">
                                    <WrenchIcon className="text-[#ec028b] w-5 h-5" />
                                    <p className="text-white font-black text-[10px] uppercase tracking-widest">Quality Standard</p>
                                </div>
                                <p className="text-gray-400 text-xs leading-relaxed italic">
                                    "Your project is being tracked with RHIVE OS military-grade precision. We don't just build roofs; we engineer protection."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerTrackerPage;
