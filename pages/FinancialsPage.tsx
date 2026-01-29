
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { DocumentTextIcon, Check, CurrencyDollarIcon, BriefcaseIcon } from '../components/icons';

const FinancialsPage: React.FC = () => {
    const { projects } = useMockDB();

    const invoicingProjects = projects.filter(p => p.current_stage === 'Invoicing');
    const completedProjects = projects.filter(p => p.current_stage === 'Completed' || p.current_stage === 'Past Customer');

    return (
        <PageContainer title="Financials & Archives" description="Invoicing, Collections, and Project Records.">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Invoicing Queue */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Accounts Receivable (Invoicing Stage)">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-800">
                                        <th className="pb-4 pl-2 font-medium uppercase tracking-wider text-xs">Project</th>
                                        <th className="pb-4 font-medium uppercase tracking-wider text-xs">Amount Due</th>
                                        <th className="pb-4 font-medium uppercase tracking-wider text-xs">Status</th>
                                        <th className="pb-4 text-right pr-2 font-medium uppercase tracking-wider text-xs">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {invoicingProjects.length > 0 ? invoicingProjects.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-900/50 transition-colors group">
                                            <td className="py-4 pl-2 font-bold text-white group-hover:text-[#ec028b] transition-colors">{p.name}</td>
                                            <td className="py-4 text-white font-mono">$1,250.00</td>
                                            <td className="py-4 text-gray-400">
                                                <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">Pending</span>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <Button size="sm" className="h-8 px-3">Process</Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-gray-600 italic border border-dashed border-gray-800 rounded-lg m-4">
                                                No active invoices pending.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card title="Project Archive (Completed)">
                        <div className="space-y-3">
                            {completedProjects.map(p => (
                                <div key={p._id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-gray-800 hover:border-gray-600 transition-all group">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-full bg-gray-900 border border-gray-700 text-[#ec028b] mr-4">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-white font-semibold group-hover:text-[#ec028b]">{p.name}</span>
                                            <span className="text-xs text-gray-500 font-mono">{p._id}</span>
                                        </div>
                                    </div>
                                    <Button variant="secondary" size="sm" className="border-gray-700 text-gray-400 hover:text-white">Records</Button>
                                </div>
                            ))}
                            {completedProjects.length === 0 && <p className="text-gray-600 text-sm italic p-4 text-center">No archived projects found.</p>}
                        </div>
                    </Card>
                </div>

                {/* Summary Stats */}
                <div className="space-y-6">
                    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Outstanding</h3>
                        <p className="text-4xl font-extrabold text-white flex items-center">
                            <span className="text-[#ec028b] mr-2 text-2xl">$</span> 12,450
                        </p>
                    </div>
                    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Collected This Month</h3>
                        <p className="text-4xl font-extrabold text-white flex items-center">
                            <span className="text-gray-500 mr-2 text-2xl">$</span> 84,200
                        </p>
                    </div>
                    
                    <Card title="Quick Actions">
                        <div className="space-y-3">
                            <Button variant="secondary" className="w-full justify-start hover:border-[#ec028b]/50 hover:text-[#ec028b] group">
                                <DocumentTextIcon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#ec028b]" /> Create Manual Invoice
                            </Button>
                            <Button variant="secondary" className="w-full justify-start hover:border-[#ec028b]/50 hover:text-[#ec028b] group">
                                <CurrencyDollarIcon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#ec028b]" /> Record Offline Payment
                            </Button>
                            <Button variant="secondary" className="w-full justify-start hover:border-[#ec028b]/50 hover:text-[#ec028b] group">
                                <BriefcaseIcon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-[#ec028b]" /> Export Financial Report
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default FinancialsPage;
