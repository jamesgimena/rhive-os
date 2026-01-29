
import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { DocumentCheckIcon, PencilSquareIcon } from '../components/icons';

const CustomerDashboard: React.FC = () => {
    const { currentUser, getUserProjects, approveQuote } = useMockDB();
    
    if (!currentUser) return <div>Please log in.</div>;

    const myProjects = getUserProjects(currentUser.id);
    // Find project requiring attention (Quote stage)
    const activeQuoteProject = myProjects.find(p => p.current_stage === 'Quote' || p.current_stage === 'Sign & Verify');

    const handleApprove = () => {
        if (activeQuoteProject) {
            approveQuote(activeQuoteProject._id);
            alert("Quote Approved! Project moved to 'Sign & Verify' stage. Contractors will be notified soon.");
        }
    };

    return (
        <div className="h-full flex flex-col text-white">
            <header className="p-4 flex justify-between items-center border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm shrink-0">
                <h1 className="text-xl font-bold">RHIVE Customer Portal</h1>
                <div className="text-sm">
                    <span>Welcome, {currentUser.name}</span>
                </div>
            </header>
            
            <main className="p-6 md:p-10 flex-1 overflow-y-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">Your Project Dashboard</h2>
                </div>

                {activeQuoteProject && activeQuoteProject.quote ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2">
                            <Card title={`Action Required: ${activeQuoteProject.name}`} className="h-full border-[#ec028b]">
                               <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-4 rounded-lg">
                                        <h3 className="text-lg font-bold mb-2">Quote Ready for Review</h3>
                                        <p className="text-gray-300 mb-4">Our team has finalized the estimate for your project. Please review and approve to proceed.</p>
                                        <ul className="space-y-2 mb-6 border-t border-b border-gray-700 py-4">
                                            {activeQuoteProject.quote.items.map((item, i) => (
                                                <li key={i} className="flex justify-between text-sm">
                                                    <span>{item.name}</span>
                                                    <span className="font-mono">${item.cost.toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-[#ec028b]">Total: ${activeQuoteProject.quote.total.toLocaleString()}</span>
                                            {activeQuoteProject.quote.status === 'Approved' ? (
                                                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/50 font-bold">Approved ✓</span>
                                            ) : (
                                                <Button size="lg" onClick={handleApprove}>Approve & Schedule</Button>
                                            )}
                                        </div>
                                    </div>
                               </div>
                            </Card>
                        </div>
                        <div>
                            <Card title="Project Timeline">
                                <div className="space-y-4 relative">
                                    {['Lead', 'Estimate', 'Quote', 'Sign & Verify', 'Schedule'].map((step, i) => {
                                        const isCurrent = step === activeQuoteProject.current_stage;
                                        // Simple logic to verify if step is passed
                                        const isPassed = false; // Simplified for demo
                                        return (
                                            <div key={step} className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-3 ${isCurrent ? 'bg-[#ec028b] ring-4 ring-[#ec028b]/30' : 'bg-gray-700'}`}></div>
                                                <span className={isCurrent ? 'text-white font-bold' : 'text-gray-500'}>{step}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-10 bg-gray-900/50 rounded-xl">
                        <p className="text-gray-400">No active quotes pending approval. Check back later!</p>
                    </div>
                )}

                <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">Your Property Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myProjects.map(p => (
                            <Card key={p._id} title={p.name}>
                                <p className="text-gray-400 text-sm">{p._id}</p>
                                <p className="mt-2"><span className="text-xs bg-gray-700 px-2 py-1 rounded text-white">{p.current_stage}</span></p>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
