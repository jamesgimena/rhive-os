import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { ChartBarIcon, BriefcaseIcon, UserIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { projectService } from '../lib/firebaseService';

const EmployeeDashboard: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-01');
    const [recentProjects, setRecentProjects] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            console.log('🔥 Firebase data received:', data);
            console.log('🔥 Number of documents:', data.length);

            const mapped = data.map((p: any) => {
                console.log('📄 Document:', p);
                return {
                    _id: p.id,
                    name: p.name,
                    current_stage: p.current_stage || p.status || 'Lead',
                    status: p.status || 'Active',
                    last_updated: p.updated_at || p.created_at || new Date().toISOString()
                };
            });

            const sorted = mapped.sort((a: any, b: any) =>
                new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
            ).slice(0, 5);

            console.log('✅ Sorted projects for display:', sorted);
            setRecentProjects(sorted);
        });
        return () => unsubscribe();
    }, []);

    const timeAgo = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

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
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="font-bold text-white">120</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Quote</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <span className="font-bold text-white">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">In Progress</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <span className="font-bold text-white">25</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Completed</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="font-bold text-white">88</span>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity Card */}
                <Card title="Recent Activity" className="lg:col-span-2">
                    <div className="space-y-6">
                        {recentProjects.map((project) => (
                            <div key={project._id} className="flex items-start gap-4 border-b border-gray-800/50 pb-6 last:border-0 last:pb-0 group">
                                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[#ec028b] shadow-[0_0_10px_#ec028b] shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-300 leading-relaxed">
                                        <span className="font-bold text-white">New Lead</span> submitted form <span className="font-bold text-[#ec028b]">{project.name}</span>.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{timeAgo(project.last_updated)}</p>
                                </div>
                            </div>
                        ))}
                        {recentProjects.length === 0 && (
                            <div className="text-center py-8 text-gray-500 italic">No recent activity found.</div>
                        )}
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default EmployeeDashboard;