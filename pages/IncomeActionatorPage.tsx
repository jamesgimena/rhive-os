import React, { useMemo } from 'react';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
// Fixed: Using default import for Button component
import Button from '../components/Button';
import Card from '../components/Card';
import {
    CurrencyDollarIcon,
    BoltIcon,
    ArrowRightIcon,
    UserIcon,
    BriefcaseIcon,
    DocumentTextIcon
} from '../components/icons';
import { cn } from '../lib/utils';

const IncomeActionatorPage: React.FC = () => {
    const { projects, setCurrentProjectId } = useMockDB();
    const { setActivePageId } = useNavigation();

    // Commission logic: assume 10% average commission on project value
    const potentialCommission = useMemo(() => {
        return projects.reduce((sum, p) => sum + ((p.quote?.total || 15000) * 0.1), 0);
    }, [projects]);

    // Actionator Philosophy: Sort by project_value DESC
    const tasks = useMemo(() => {
        return projects
            .map(p => ({
                id: p._id,
                name: p.name,
                value: p.quote?.total || 15000,
                stage: p.current_stage,
                task: p.current_stage === 'Lead' ? 'Qualify Opportunity' :
                    p.current_stage === 'Estimate' ? 'Finalize AI Data' :
                        p.current_stage === 'Quote' ? 'Follow up on Quote' :
                            'Monitor Progress'
            }))
            .sort((a, b) => b.value - a.value);
    }, [projects]);

    const handleAction = (id: string) => {
        setCurrentProjectId(id);
        setActivePageId('E-06'); // Jump to Quote Builder for high-value action
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />

            <div className="relative z-20 flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
                {/* Gamified Ticker */}
                <div className="w-full max-w-4xl bg-gray-900/60 backdrop-blur-xl border border-[#ec028b]/30 rounded-3xl p-8 mb-10 text-center shadow-[0_0_50px_rgba(236,2,139,0.1)]">
                    <p className="text-[#ec028b] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">Pipeline Net Potential Commission</p>
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl bg-[#ec028b]/20 rounded-full"></div>
                        <h2 className="relative text-6xl md:text-8xl font-black text-white tracking-tighter flex items-center justify-center">
                            <span className="text-[#ec028b] mr-4">$</span>
                            <span className="animate-pulse">{potentialCommission.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </h2>
                    </div>
                    <div className="mt-8 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Pipeline Value</p>
                            <p className="text-white font-mono font-bold text-lg">${(potentialCommission * 10).toLocaleString()}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-800 self-center"></div>
                        <div className="text-center">
                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Avg Deal Size</p>
                            <p className="text-white font-mono font-bold text-lg">$14,500</p>
                        </div>
                    </div>
                </div>

                {/* Task List (Sorted by Value) */}
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

                    <div className="space-y-4 pb-20">
                        {tasks.map((task, idx) => (
                            <Card
                                key={task.id}
                                className="group relative mb-4 p-5 flex items-center justify-between hover:bg-gray-900/60"
                            >
                                {/* Impact Indicator Line */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ec028b] rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-black border border-gray-700 flex items-center justify-center text-[#ec028b] group-hover:scale-110 transition-transform">
                                        <CurrencyDollarIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg leading-none mb-2">{task.name}</h4>
                                        <p className="text-[#ec028b] text-xs font-bold uppercase tracking-wider">{task.task}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden md:block">
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Project Value</p>
                                        <p className="text-white font-mono font-bold text-xl">${task.value.toLocaleString()}</p>
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
                </div>
            </div>
        </div>
    );
};

export default IncomeActionatorPage;
