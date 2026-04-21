
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    CurrencyDollarIcon,
    BoltIcon,
    ArrowRightIcon,
} from '../components/icons';
import { projectService } from '../lib/firebaseService';
import { cn } from '../lib/utils';

const stageTask = (stage: string): string => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead'))     return 'Qualify Opportunity';
    if (s.includes('estimate')) return 'Finalize AI Data';
    if (s.includes('quote'))    return 'Follow up on Quote';
    if (s.includes('sign'))     return 'Chase Signature';
    if (s.includes('schedule')) return 'Coordinate Logistics';
    if (s.includes('install'))  return 'Monitor Installation';
    if (s.includes('invoic'))   return 'Collect Payment';
    return 'Monitor Progress';
};

const IncomeActionatorPage: React.FC = () => {
    const { setActivePageId, setSelectedProjectId } = useNavigation();
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

    // Commission logic: 10% average commission on project value
    const potentialCommission = useMemo(() => {
        return firebaseProjects.reduce((sum, p) => sum + ((p.quote?.total || 15000) * 0.1), 0);
    }, [firebaseProjects]);

    const totalPipelineValue = useMemo(() => {
        return firebaseProjects.reduce((sum, p) => sum + (p.quote?.total || 15000), 0);
    }, [firebaseProjects]);

    const avgDealSize = useMemo(() => {
        if (firebaseProjects.length === 0) return 0;
        return Math.round(totalPipelineValue / firebaseProjects.length);
    }, [firebaseProjects, totalPipelineValue]);

    // Sort by value DESC for maximum income impact
    const tasks = useMemo(() => {
        return firebaseProjects
            .map(p => ({
                id: p.id,
                name: p.name || 'Unnamed Project',
                value: p.quote?.total || 15000,
                stage: p.current_stage || 'Lead',
                task: stageTask(p.current_stage || ''),
                address: p.property_address || p.property?.address || '',
            }))
            .sort((a, b) => b.value - a.value);
    }, [firebaseProjects]);

    const handleAction = (id: string) => {
        setSelectedProjectId(id);
        setActivePageId('E-06'); // Jump to Quote Builder for high-value action
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />

            <div className="relative z-20 flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">

                {/* Live sync badge */}
                <div className="w-full max-w-4xl flex justify-end mb-4">
                    <div className={cn(
                        "flex items-center gap-2 text-xs font-bold uppercase tracking-widest",
                        loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                    )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400 shadow-[0_0_8px_#4ade80]")} />
                        {loading ? 'Syncing Firebase…' : `${firebaseProjects.length} Projects Live`}
                    </div>
                </div>

                {/* Gamified Commission Ticker */}
                <div className="w-full max-w-4xl bg-gray-900/60 backdrop-blur-xl border border-[#ec028b]/30 rounded-3xl p-8 mb-10 text-center shadow-[0_0_50px_rgba(236,2,139,0.1)]">
                    <p className="text-[#ec028b] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
                        Pipeline Net Potential Commission
                    </p>
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl bg-[#ec028b]/20 rounded-full" />
                        <h2 className="relative text-6xl md:text-8xl font-black text-white tracking-tighter flex items-center justify-center">
                            <span className="text-[#ec028b] mr-4">$</span>
                            <span className={loading ? "opacity-30" : "animate-pulse"}>
                                {potentialCommission.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </h2>
                    </div>

                    <div className="mt-8 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Pipeline Value</p>
                            <p className="text-white font-mono font-bold text-lg">
                                ${totalPipelineValue.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-gray-800 self-center" />
                        <div className="text-center">
                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Avg Deal Size</p>
                            <p className="text-white font-mono font-bold text-lg">
                                ${avgDealSize.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-gray-800 self-center" />
                        <div className="text-center">
                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Active Deals</p>
                            <p className="text-white font-mono font-bold text-lg">{firebaseProjects.length}</p>
                        </div>
                    </div>
                </div>

                {/* Task List (sorted by value) */}
                <div className="w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <BoltIcon className="w-5 h-5 text-[#ec028b] mr-2" />
                            Income Actionator List
                        </h3>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                            Priority: Highest Dollar Impact
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[0, 1, 2].map(i => <div key={i} className="h-20 bg-gray-900 border border-gray-800 rounded-xl" />)}
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl text-gray-600">
                            <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-sm">No projects in pipeline yet</p>
                            <p className="text-xs mt-2 text-gray-700">Add leads via Customer Input to see them here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-20">
                            {tasks.map((task, idx) => (
                                <Card
                                    key={task.id}
                                    className="group relative mb-4 p-5 flex items-center justify-between hover:bg-gray-900/60"
                                >
                                    {/* Impact rank */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ec028b] rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        {/* Rank badge */}
                                        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-gray-700 text-xs font-black text-gray-500 group-hover:border-[#ec028b] group-hover:text-[#ec028b] transition-all">
                                            {idx + 1}
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-black border border-gray-700 flex items-center justify-center text-[#ec028b] group-hover:scale-110 transition-transform shrink-0">
                                            <CurrencyDollarIcon className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-white font-bold text-lg leading-none mb-1 truncate">
                                                {task.name}
                                            </h4>
                                            {task.address && (
                                                <p className="text-gray-500 text-[10px] truncate mb-1">{task.address}</p>
                                            )}
                                            <p className="text-[#ec028b] text-xs font-bold uppercase tracking-wider">
                                                {task.task}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0 ml-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Project Value</p>
                                            <p className="text-white font-mono font-bold text-xl">
                                                ${task.value.toLocaleString()}
                                            </p>
                                            <p className="text-[#ec028b] text-[9px] font-black uppercase">
                                                ~${Math.round(task.value * 0.1).toLocaleString()} comm.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleAction(task.id)}
                                            className="h-12 w-12 rounded-full bg-[#ec028b] text-white flex items-center justify-center shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <ArrowRightIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomeActionatorPage;
