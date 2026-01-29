import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';
import { DocumentTextIcon, ChartBarIcon } from '../components/icons';

const ContractorAdminPanelPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'CO-02');
    const [activeTab, setActiveTab] = useState('info');

    const documents = [
        { name: 'W-9 Form', status: 'on-file', date: '2023-01-15' },
        { name: 'General Liability Insurance', status: 'on-file', date: '2023-02-20' },
        { name: 'Workers Compensation', status: 'expired', date: '2023-08-01' },
        { name: 'State License', status: 'on-file', date: '2023-03-10' },
    ];

    const payments = [
        { id: 'PAY-992', project: 'Henderson Residence', amount: '$5,000.00', date: 'Oct 1, 2023', status: 'paid' },
        { id: 'PAY-998', project: 'Galleria Mall', amount: '$3,200.00', date: 'Pending', status: 'processing' },
        { id: 'PAY-881', project: 'Smith Roof', amount: '$4,150.00', date: 'Aug 20, 2023', status: 'paid' },
    ];

    return (
        <PageContainer title="Contractor Admin & Financials" description="Manage your company profile, compliance, and earnings.">
            <Card>
                <div className="border-b border-gray-700 overflow-x-auto">
                    <nav className="-mb-px flex space-x-6 px-6">
                         <button onClick={() => setActiveTab('info')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'info' ? 'border-[#ec028b] text-[#ec028b]' : 'border-transparent text-gray-400 hover:text-white'}`}>Company Info</button>
                         <button onClick={() => setActiveTab('docs')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'docs' ? 'border-[#ec028b] text-[#ec028b]' : 'border-transparent text-gray-400 hover:text-white'}`}>Required Documents</button>
                         <button onClick={() => setActiveTab('pricing')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'pricing' ? 'border-[#ec028b] text-[#ec028b]' : 'border-transparent text-gray-400 hover:text-white'}`}>Service Pricing</button>
                         <button onClick={() => setActiveTab('financials')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'financials' ? 'border-[#ec028b] text-[#ec028b]' : 'border-transparent text-gray-400 hover:text-white'}`}>Financials</button>
                    </nav>
                </div>
                <div className="p-6 min-h-[400px]">
                    
                    {activeTab === 'info' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Company Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                                    <input type="text" className="w-full bg-gray-900/50 border border-gray-700 rounded p-2 text-white" defaultValue="Quality Roofing LLC" />
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tax ID / EIN</label>
                                        <input type="text" className="w-full bg-gray-900/50 border border-gray-700 rounded p-2 text-white" defaultValue="XX-XXXXXXX" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                        <input type="text" className="w-full bg-gray-900/50 border border-gray-700 rounded p-2 text-white" defaultValue="(801) 555-0199" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Mailing Address</label>
                                    <input type="text" className="w-full bg-gray-900/50 border border-gray-700 rounded p-2 text-white" defaultValue="456 Contractor Ave, Salt Lake City, UT" />
                                </div>
                                <div className="pt-4">
                                    <Button>Save Changes</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                         <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Compliance Documents</h3>
                                <Button size="sm">Upload New Document</Button>
                            </div>
                            <div className="space-y-3">
                                {documents.map(doc => (
                                    <div key={doc.name} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center">
                                            <DocumentTextIcon className="w-6 h-6 text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-white font-medium">{doc.name}</p>
                                                <p className="text-xs text-gray-400">Last Updated: {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <StatusBadge status={doc.status as any} />
                                            <Button variant="secondary" size="sm">Update</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div>
                             <h3 className="text-lg font-bold text-white mb-4">Labor Rate Card</h3>
                             <p className="text-sm text-gray-400 mb-4">Set your standard rates for common tasks. These will be used to pre-populate bids.</p>
                             <div className="space-y-2">
                                 <div className="grid grid-cols-3 text-sm font-semibold text-gray-500 pb-2 border-b border-gray-800">
                                     <span>Service</span>
                                     <span>Unit</span>
                                     <span className="text-right">Rate ($)</span>
                                 </div>
                                 <div className="grid grid-cols-3 items-center py-2 border-b border-gray-800/50">
                                     <span className="text-white">Shingle Install (Standard)</span>
                                     <span className="text-gray-400">per Square</span>
                                     <input className="text-right bg-transparent border border-gray-700 rounded px-2 py-1 w-24 justify-self-end text-white" defaultValue="65.00" />
                                 </div>
                                  <div className="grid grid-cols-3 items-center py-2 border-b border-gray-800/50">
                                     <span className="text-white">Tear-off (1 Layer)</span>
                                     <span className="text-gray-400">per Square</span>
                                     <input className="text-right bg-transparent border border-gray-700 rounded px-2 py-1 w-24 justify-self-end text-white" defaultValue="35.00" />
                                 </div>
                                  <div className="grid grid-cols-3 items-center py-2 border-b border-gray-800/50">
                                     <span className="text-white">Trip Charge</span>
                                     <span className="text-gray-400">Flat Rate</span>
                                     <input className="text-right bg-transparent border border-gray-700 rounded px-2 py-1 w-24 justify-self-end text-white" defaultValue="150.00" />
                                 </div>
                             </div>
                             <div className="mt-6 text-right">
                                 <Button>Update Rates</Button>
                             </div>
                        </div>
                    )}

                    {activeTab === 'financials' && (
                         <div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                 <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                                     <p className="text-gray-400 text-sm">YTD Earnings</p>
                                     <p className="text-3xl font-bold text-green-400">$87,500</p>
                                 </div>
                                 <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                                     <p className="text-gray-400 text-sm">Pending Payments</p>
                                     <p className="text-3xl font-bold text-yellow-400">$3,200</p>
                                 </div>
                                 <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                                     <div className="text-center">
                                        <ChartBarIcon className="w-8 h-8 mx-auto text-[#ec028b] mb-1" />
                                        <span className="text-white font-medium">View Reports</span>
                                     </div>
                                 </div>
                             </div>

                             <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>
                             <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-700">
                                            <th className="pb-2 pl-2">Reference</th>
                                            <th className="pb-2">Project</th>
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2 text-right">Amount</th>
                                            <th className="pb-2 text-right pr-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {payments.map(p => (
                                            <tr key={p.id} className="hover:bg-gray-800/30">
                                                <td className="py-3 pl-2 text-gray-400 font-mono">{p.id}</td>
                                                <td className="py-3 text-white font-medium">{p.project}</td>
                                                <td className="py-3 text-gray-400">{p.date}</td>
                                                <td className="py-3 text-right text-white font-mono">{p.amount}</td>
                                                <td className="py-3 text-right pr-2">
                                                    <StatusBadge status={p.status as any} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                             <div className="mt-6 flex justify-center">
                                 <Button variant="secondary" size="sm">Load More Transactions</Button>
                             </div>
                         </div>
                    )}

                </div>
            </Card>
        </PageContainer>
    );
};

export default ContractorAdminPanelPage;