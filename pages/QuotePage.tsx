import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { CircuitryBackground } from '../components/CircuitryBackground';
import { RhiveLogo, Info as ExclamationTriangleIcon, ClockIcon } from '../components/icons';
import { cn } from '../lib/utils'; // Assuming cn utility exists

const QuotePage: React.FC = () => {
    const { projects, currentUser } = useMockDB();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?._id || null);
    const selectedProject = projects.find(p => p._id === selectedProjectId);

    // RPSP Logic (Mocked)
    const RPSP_WINDOW_HOURS = 48;
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {
        if (selectedProject) {
            // Mock creation time as 24 hours ago for demo
            const mockCreatedAt = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
            const expiresAt = mockCreatedAt + (RPSP_WINDOW_HOURS * 60 * 60 * 1000);

            const interval = setInterval(() => {
                const remaining = Math.max(0, expiresAt - Date.now());
                setTimeRemaining(remaining);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [selectedProject]);

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const isRPSPActive = timeRemaining > 0;
    const projectTotal = selectedProject?.quote?.total || 18500;
    const discountAmount = isRPSPActive ? (projectTotal * 0.10) : 0;
    const finalTotal = projectTotal - discountAmount;

    // Dual-Math Logic (Admin/Employee Only)
    const internalCost = projectTotal * 0.65; // Mock 35% margin
    const margin = projectTotal - internalCost;

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex">
            <CircuitryBackground />

            {/* Left Sidebar for Projects */}
            <aside className="relative z-20 w-80 bg-black/80 backdrop-blur-xl border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800 flex items-center">
                    <RhiveLogo className="h-8 w-auto mr-3 text-[#ec028b]" />
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase">Quotes</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {projects.map(p => (
                        <div
                            key={p._id}
                            onClick={() => setSelectedProjectId(p._id)}
                            className={cn(
                                "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                selectedProjectId === p._id
                                    ? "bg-[#ec028b]/10 border-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.2)]"
                                    : "bg-gray-900/40 border-gray-800 hover:border-gray-600"
                            )}
                        >
                            <p className="font-bold text-white text-sm">{p.name}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">ID: {p._id.split('-').pop()}</span>
                                <StatusBadge status={p.current_stage === 'Quote' ? 'pending' : 'active'} />
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-20 flex-1 p-10 overflow-y-auto">
                {selectedProject ? (
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Header with RPSP Timer */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-white uppercase italic">Certified Quote</h1>
                                <p className="text-gray-400 mt-2 font-mono">{selectedProject.address || '123 Project Address'}</p>
                            </div>

                            {isRPSPActive ? (
                                <div className="text-right">
                                    <p className="text-[#ec028b] font-bold text-xs uppercase tracking-widest mb-1 animate-pulse flex items-center justify-end">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        Promotion Expires In
                                    </p>
                                    <div className="text-4xl font-mono font-bold text-white bg-black/50 px-4 py-2 rounded-lg border border-[#ec028b]/50 shadow-[0_0_20px_rgba(236,2,139,0.2)]">
                                        {formatTime(timeRemaining)}
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4 py-2 border border-red-900 bg-red-900/20 text-red-500 rounded-lg text-sm font-bold uppercase">
                                    Promotion Expired
                                </div>
                            )}
                        </div>

                        {/* Dual-Math Dashboard (Internal View) */}
                        {currentUser?.role !== 'Customer' && (
                            <div className="grid grid-cols-2 gap-6 p-6 border border-gray-800 rounded-2xl bg-black/40 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b] to-transparent opacity-50"></div>
                                <div className="absolute top-2 right-2 text-[9px] text-gray-600 font-bold uppercase border border-gray-800 px-2 rounded">Internal Data</div>

                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Internal Cost (Floor)</p>
                                    <p className="text-2xl font-mono text-gray-300">${internalCost.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Margin</p>
                                    <p className="text-2xl font-mono text-[#ec028b] font-bold">+${margin.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Line Items */}
                            <div className="md:col-span-2 space-y-6">
                                <Card title="Project Specifications">
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 border-b border-gray-800">
                                            <span className="text-gray-300">Owens Corning Duration Shingles</span>
                                            <span className="text-white font-mono">${(projectTotal * 0.8).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-800">
                                            <span className="text-gray-300">Synthetic Underlayment (RhinoRoof)</span>
                                            <span className="text-white font-mono">${(projectTotal * 0.1).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b border-gray-800">
                                            <span className="text-gray-300">Ice & Water Shield (Valleys/Eaves)</span>
                                            <span className="text-white font-mono">${(projectTotal * 0.1).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Totals Card */}
                            <div className="md:col-span-1">
                                <Card className="sticky top-10">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="text-white font-mono">${projectTotal.toLocaleString()}</span>
                                        </div>

                                        {isRPSPActive && (
                                            <div className="flex justify-between text-sm text-[#ec028b] font-bold">
                                                <span className="flex items-center"><BoltIcon className="w-3 h-3 mr-1" /> RPSP Savings (10%)</span>
                                                <span className="font-mono">-${discountAmount.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="border-t border-gray-700 my-4 pt-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-gray-300 font-bold uppercase text-xs">Total Investment</span>
                                                <span className="text-3xl font-black text-white font-mono leading-none">
                                                    ${finalTotal.toLocaleString()}
                                                </span>
                                            </div>
                                            {isRPSPActive && (
                                                <p className="text-[10px] text-[#ec028b] text-right mt-1 font-bold animate-pulse">
                                                    Locked for {formatTime(timeRemaining)}
                                                </p>
                                            )}
                                        </div>

                                        <Button size="lg" className="w-full mt-4 shadow-[0_0_20px_rgba(236,2,139,0.3)] hover:shadow-[0_0_30px_rgba(236,2,139,0.5)]">
                                            Sign & Accept Quote
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <ExclamationTriangleIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p>Select a project to view quote details.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// Helper (assuming BoltIcon isn't exported or needs local def)
const BoltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
    </svg>
);

export default QuotePage;
