import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
    ChartBarIcon, 
    ArrowPathIcon, 
    DocumentTextIcon, 
    CalendarDaysIcon 
} from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const KPICard = ({ title, value, change, positive }: { title: string, value: string, change: string, positive: boolean }) => (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 backdrop-blur-md shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className={`ml-2 text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
                {positive ? '↑' : '↓'} {change}
            </span>
        </div>
    </div>
);

const ReportingPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-RPT');
    const [timeRange, setTimeRange] = useState('This Month');

    const reports = [
        { id: 1, name: 'Q3 Profit & Loss Statement', type: 'Financial', date: 'Oct 1, 2023', generatedBy: 'System' },
        { id: 2, name: 'Sept Sales Performance', type: 'Sales', date: 'Oct 2, 2023', generatedBy: 'Mike R.' },
        { id: 3, name: 'Inventory Variance Report', type: 'Inventory', date: 'Sept 28, 2023', generatedBy: 'Warehouse' },
        { id: 4, name: 'Q3 Roofing Market Share Analysis', type: 'Strategy', date: 'Oct 5, 2023', generatedBy: 'Exec Team' },
        { id: 5, name: 'Vendor Expense Summary', type: 'Financial', date: 'Sept 30, 2023', generatedBy: 'System' },
    ];

    return (
        <PageContainer title={page?.name || 'Reporting Dashboard'} description="Real-time analytics and company performance metrics.">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                    {['This Week', 'This Month', 'Last Quarter', 'YTD'].map(range => (
                        <button 
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${timeRange === range ? 'bg-[#ec028b] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <Button variant="secondary" size="sm">
                    <ArrowPathIcon className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard title="Total Revenue" value="$1,245,000" change="12.5%" positive={true} />
                <KPICard title="Gross Profit" value="$415,000" change="8.2%" positive={true} />
                <KPICard title="Active Projects" value="42" change="2.1%" positive={true} />
                <KPICard title="Avg. Margin" value="33.4%" change="1.1%" positive={false} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Market Share Visualization */}
                <Card className="lg:col-span-2">
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-2">Market Performance</h3>
                        <p className="text-gray-400 text-sm mb-6">RHIVE dominance in local residential roofing sector.</p>
                        
                        <div className="relative h-12 bg-gray-700 rounded-full overflow-hidden mb-2 shadow-inner">
                            <div className="absolute top-0 left-0 h-full bg-[#ec028b] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_#ec028b]" style={{width: '35%'}}>
                                RHIVE (35%)
                            </div>
                            <div className="absolute top-0 left-[35%] h-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs border-l border-gray-800" style={{width: '25%'}}>
                                Comp A (25%)
                            </div>
                             <div className="absolute top-0 left-[60%] h-full bg-gray-500 flex items-center justify-center text-gray-300 text-xs border-l border-gray-800" style={{width: '20%'}}>
                                Comp B (20%)
                            </div>
                             <div className="absolute top-0 left-[80%] h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs border-l border-gray-800" style={{width: '20%'}}>
                                Others (20%)
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                            <span>Target: 40% Share</span>
                            <span>Current: 35% (Leading)</span>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Leads Captured</p>
                                <p className="text-lg font-bold text-white">1,204</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Conversion Rate</p>
                                <p className="text-lg font-bold text-green-400">28%</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-xs text-gray-400">Customer Satisfaction</p>
                                <p className="text-lg font-bold text-[#ec028b]">4.9/5</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Report Actions */}
                <Card title="Quick Actions">
                    <div className="space-y-3">
                        <Button className="w-full justify-start">
                            <ChartBarIcon className="w-5 h-5 mr-2" /> Generate Financial Report
                        </Button>
                        <Button variant="secondary" className="w-full justify-start">
                            <ChartBarIcon className="w-5 h-5 mr-2" /> Export Sales Data (CSV)
                        </Button>
                         <Button variant="secondary" className="w-full justify-start">
                            <ChartBarIcon className="w-5 h-5 mr-2" /> View Commission Log
                        </Button>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-700">
                         <p className="text-xs text-gray-500 mb-2">Scheduled Reports</p>
                         <div className="flex items-center justify-between bg-gray-900/50 p-2 rounded">
                            <span className="text-sm text-gray-300">Weekly Sales Recap</span>
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Active</span>
                         </div>
                    </div>
                </Card>
            </div>

            {/* Detailed Reports Table */}
            <Card title="Available Reports">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-sm border-b border-gray-700">
                                <th className="p-4 font-medium">Report Name</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Date Generated</th>
                                <th className="p-4 font-medium">Generated By</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {reports.map((r, idx) => (
                                <tr key={r.id} className={`group hover:bg-gray-700/30 transition-colors ${idx !== reports.length - 1 ? 'border-b border-gray-800' : ''}`}>
                                    <td className="p-4 text-white font-medium flex items-center">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-3 group-hover:text-[#ec028b] transition-colors" />
                                        {r.name}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        <span className="px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs">{r.type}</span>
                                    </td>
                                    <td className="p-4 text-gray-400">{r.date}</td>
                                    <td className="p-4 text-gray-400">{r.generatedBy}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="text-gray-400 hover:text-white text-xs underline">View</button>
                                        <button className="text-[#ec028b] hover:text-white text-xs font-semibold">Download</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

        </PageContainer>
    );
};

export default ReportingPage;