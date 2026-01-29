import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { ChartBarIcon, BriefcaseIcon, UserIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const EmployeeDashboard: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-02');

    return (
        <PageContainer title={page?.name || 'Employee Dashboard'} description={page?.description || 'Your personal performance analytics.'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Performance Card */}
                <Card title="Sales Performance (Q3)" className="lg:col-span-2">
                    <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-16 h-16 text-gray-700" />
                        <p className="absolute text-gray-500">Sales Chart Placeholder</p>
                    </div>
                </Card>

                {/* KPIs Card */}
                <Card title="Key Metrics">
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Quotes Sent This Month</p>
                            <p className="text-2xl font-bold text-white">42</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Contracts Signed</p>
                            <p className="text-2xl font-bold text-white">18</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Close Rate</p>
                            <p className="text-2xl font-bold text-green-400">42.8%</p>
                        </div>
                    </div>
                </Card>

                {/* Project Statuses Card */}
                <Card title="Project Status Overview">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Lead</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{width: '90%'}}></div>
                            </div>
                             <span className="font-bold text-white">120</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Quote</span>
                             <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{width: '60%'}}></div>
                            </div>
                            <span className="font-bold text-white">42</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-300">In Progress</span>
                             <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{width: '40%'}}></div>
                            </div>
                            <span className="font-bold text-white">25</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Completed</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{width: '25%'}}></div>
                            </div>
                            <span className="font-bold text-white">88</span>
                        </div>
                    </div>
                </Card>

                {/* Lead Conversion Funnel */}
                <Card title="Lead Conversion Funnel" className="lg:col-span-2">
                    <div className="h-48 bg-gray-900/50 rounded-lg flex items-center justify-center">
                         <UserIcon className="w-16 h-16 text-gray-700" />
                        <p className="absolute text-gray-500">Conversion Funnel Chart Placeholder</p>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default EmployeeDashboard;