
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { DocumentCheckIcon, PencilSquareIcon, BriefcaseIcon, CheckCircleIcon } from '../components/icons';
import { projectService, firestoreService } from '../lib/firebaseService';
import { cn } from '../lib/utils';

const STAGE_STEPS = ['Lead', 'Estimate', 'Quote', 'Sign & Verify', 'Schedule', 'Pre-Installation', 'Install', 'Punch List', 'Invoicing', 'Completed'];

const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead'))     return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (s.includes('quote'))    return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (s.includes('sign'))     return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (s.includes('schedule') || s.includes('pre-install')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (s.includes('install'))  return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (s.includes('invoic'))   return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (s.includes('complet'))  return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    return 'bg-gray-700 text-gray-300 border-gray-600';
};

const CustomerDashboard: React.FC = () => {
    const { currentUser } = useMockDB();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to all Firebase projects in real-time
    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (!currentUser) return <div className="p-10 text-white">Please log in.</div>;

    // For customer view: show the most recent project (in a real app, filter by user ID)
    const activeQuoteProject = projects.find(p => {
        const cs = (p.current_stage || '').toLowerCase();
        return cs.includes('quote') || cs.includes('sign');
    });

    const getAddress = (project: any): string => {
        return [project.property_address || project.property?.address, project.property?.city, project.property?.state]
            .filter(Boolean).join(', ') || 'Address not set';
    };

    const getStageIndex = (stage: string): number => {
        const s = stage.toLowerCase();
        return STAGE_STEPS.findIndex(st => st.toLowerCase() === s || st.toLowerCase().includes(s));
    };

    return (
        <div className="h-full flex flex-col text-white">
            <header className="p-4 flex justify-between items-center border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm shrink-0">
                <h1 className="text-xl font-bold">RHIVE Customer Portal</h1>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",
                        loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                    )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400")} />
                        {loading ? 'Syncing…' : 'Live'}
                    </div>
                    <span className="text-sm text-gray-400">Welcome, {currentUser.name}</span>
                </div>
            </header>
            
            <main className="p-6 md:p-10 flex-1 overflow-y-auto space-y-10">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold">Your Project Dashboard</h2>
                    <p className="text-gray-500 text-sm mt-1">Live data from RHIVE OS Firebase</p>
                </div>

                {/* Active Quote requiring attention */}
                {loading ? (
                    <div className="h-48 bg-gray-900/50 rounded-xl animate-pulse" />
                ) : activeQuoteProject && activeQuoteProject.quote ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card title={`Action Required: ${activeQuoteProject.name}`} className="h-full border-[#ec028b]">
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm">{getAddress(activeQuoteProject)}</p>
                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <h3 className="text-lg font-bold mb-2">Quote Ready for Review</h3>
                                        <p className="text-gray-300 mb-4">Our team has finalized the estimate. Please review and approve to proceed.</p>
                                        <ul className="space-y-2 mb-6 border-t border-b border-gray-700 py-4">
                                            {(activeQuoteProject.quote.items || []).map((item: any, i: number) => (
                                                <li key={i} className="flex justify-between text-sm">
                                                    <span>{item.name}</span>
                                                    <span className="font-mono">${item.cost.toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-[#ec028b]">
                                                Total: ${activeQuoteProject.quote.total?.toLocaleString()}
                                            </span>
                                            {activeQuoteProject.quote.status === 'Approved' ? (
                                                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/50 font-bold flex items-center gap-2">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    Approved
                                                </span>
                                            ) : (
                                                <Button size="lg" className="flex items-center gap-2">
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    Approve & Schedule
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div>
                            <Card title="Project Timeline">
                                <div className="space-y-3">
                                    {STAGE_STEPS.slice(0, 5).map((step) => {
                                        const currentIdx = getStageIndex(activeQuoteProject.current_stage || '');
                                        const stepIdx = STAGE_STEPS.indexOf(step);
                                        const isCurrent = step.toLowerCase() === (activeQuoteProject.current_stage || '').toLowerCase() ||
                                            (activeQuoteProject.current_stage || '').toLowerCase().includes(step.toLowerCase());
                                        const isPassed = stepIdx < currentIdx;
                                        return (
                                            <div key={step} className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full shrink-0 ${isCurrent ? 'bg-[#ec028b] ring-4 ring-[#ec028b]/30 shadow-[0_0_8px_#ec028b]' : isPassed ? 'bg-green-500' : 'bg-gray-700'}`} />
                                                <span className={isCurrent ? 'text-white font-bold' : isPassed ? 'text-green-400' : 'text-gray-500'}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : !loading && (
                    <div className="text-center p-10 bg-gray-900/50 rounded-xl border border-gray-800">
                        <BriefcaseIcon className="w-12 h-12 mx-auto text-gray-700 mb-3" />
                        <p className="text-gray-400">No active quotes pending approval. Check back later!</p>
                    </div>
                )}

                {/* All projects grid */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Your Projects
                        <span className="text-sm font-normal text-gray-500">({projects.length} total)</span>
                    </h3>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[0, 1].map(i => <div key={i} className="h-28 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />)}
                        </div>
                    ) : projects.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No projects found in Firebase yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map(p => (
                                <Card key={p.id} title={p.name || 'Unnamed Project'}>
                                    <p className="text-gray-400 text-xs font-mono mb-2">{getAddress(p)}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            'text-[10px] px-2 py-1 rounded-full border font-black uppercase tracking-wider',
                                            stageBadgeColor(p.current_stage)
                                        )}>
                                            {p.current_stage || 'Lead'}
                                        </span>
                                        {p.quote?.total && (
                                            <span className="font-mono text-sm font-bold text-[#ec028b]">
                                                ${p.quote.total.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
