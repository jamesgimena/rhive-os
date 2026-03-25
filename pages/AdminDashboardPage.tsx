
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { dashboardService, projectService, userService } from '../lib/firebaseService';
import { 
    HomeIcon, 
    UserIcon, 
    ChartPieIcon, 
    CommandLineIcon,
    ShieldCheckIcon,
    IdentificationIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '../components/icons';
import { cn } from '../lib/utils';
import Card from '../components/Card';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await dashboardService.getStats();
            if (res.success) setStats(res.data);
        };

        const unsubProjects = projectService.subscribe((data) => {
            setRecentProjects(data.slice(0, 5));
        });

        const unsubUsers = userService.subscribe((data) => {
            setUserCount(data.length);
        });

        fetchStats();
        return () => {
            unsubProjects();
            unsubUsers();
        };
    }, []);

    const statCards = [
        { label: 'Network Users', value: userCount, icon: UserIcon, trend: '+12%', color: 'text-blue-400' },
        { label: 'Active Projects', value: stats?.total_projects || 0, icon: ChartPieIcon, trend: '+5%', color: 'text-[#ec028b]' },
        { label: 'Pending Quotes', value: stats?.total_estimates || 0, icon: CommandLineIcon, trend: '-2%', color: 'text-yellow-400' },
        { label: 'System Health', value: '99.9%', icon: ShieldCheckIcon, trend: 'stable', color: 'text-green-400' },
    ];

    return (
        <PageContainer 
            title="Admin Command Center" 
            description="Global overview of organization performance, user distribution, and system-wide operational metrics."
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((cur, i) => (
                    <Card key={i} className="relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">{cur.label}</p>
                                <h3 className={cn("text-3xl font-black", cur.color)}>{cur.value}</h3>
                                <div className="flex items-center gap-1 mt-2">
                                    {cur.trend.startsWith('+') ? <ArrowUpIcon className="w-3 h-3 text-green-500" /> : <ArrowDownIcon className="w-3 h-3 text-red-500" />}
                                    <span className={cn("text-[10px] font-bold uppercase", cur.trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
                                        {cur.trend} vs last month
                                    </span>
                                </div>
                            </div>
                            <div className={cn("p-2 rounded-xl bg-gray-900 border border-gray-800", cur.color)}>
                                <cur.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity">
                            <cur.icon className="w-20 h-20" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-xl">
                        <div className="p-4 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <CommandLineIcon className="w-4 h-4 text-[#ec028b]" />
                                Recent Project Activity
                            </h3>
                            <button className="text-[10px] font-bold text-[#ec028b] uppercase tracking-tighter hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-800/50">
                            {recentProjects.map((p) => (
                                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs">
                                            {p.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-none mb-1">{p.name || 'Unnamed Project'}</p>
                                            <p className="text-[10px] text-gray-500 font-mono italic">ID: {p.id.slice(-8)} • {p.current_stage || 'Intake'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-gray-500 border border-gray-800 px-2 py-0.5 rounded-full">
                                            {p.project_type || 'N/A'}
                                        </span>
                                        <div className="w-2 h-2 rounded-full bg-green-500" title="Synchronized" />
                                    </div>
                                </div>
                            ))}
                            {recentProjects.length === 0 && (
                                <div className="p-10 text-center text-gray-600 font-mono text-xs italic uppercase tracking-widest">
                                    No active event streams detected.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Radar Placeholder */}
                <div className="space-y-6">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden h-80 flex flex-col items-center justify-center text-center">
                        <ChartPieIcon className="w-20 h-20 text-[#ec028b]/20 mb-4 animate-pulse" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Operational Analytics</h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                            AI-driven performance metrics and regional penetration analysis currently initializing...
                        </p>
                        {/* Fake scanner line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ec028b]/50 to-transparent shadow-[0_0_15px_#ec028b] animate-[scan_3s_linear_infinite]" />
                    </div>

                    <div className="bg-black/60 border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <IdentificationIcon className="w-5 h-5 text-blue-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Status</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 uppercase font-black">Firewall</span>
                                <span className="text-green-500 font-bold">ACTIVE</span>
                            </div>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#ec028b] h-full w-[85%] shadow-[0_0_10px_#ec028b]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-500 uppercase font-black">Uptime</span>
                                <span className="text-blue-400 font-bold">99.999%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default AdminDashboardPage;
