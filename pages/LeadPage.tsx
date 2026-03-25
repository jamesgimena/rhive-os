
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
    BriefcaseIcon, 
    UserIcon, 
    ArrowRightIcon, 
    MapPinIcon, 
    ArrowLeftIcon,
    DocumentTextIcon,
    CalculatorIcon,
    CheckCircleIcon
} from '../components/icons';
import { projectService } from '../lib/firebaseService';
import { cn, getStagePageId } from '../lib/utils';

const stageBadgeColor = (stage?: string) => {
    const s = (stage || '').toLowerCase();
    if (s.includes('lead')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s.includes('estimate')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('quote')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (s.includes('sign')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('schedule') || s.includes('pre-install')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (s.includes('install')) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (s.includes('invoic')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s.includes('complet') || s.includes('past')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
};

const LeadPage: React.FC = () => {
    const { 
        selectedProjectId, 
        setSelectedProjectId, 
        setActivePageId, 
        setSelectedAccountId 
    } = useNavigation();
    
    // Check if we arrived here WITH a selected project.
    // If we did, and it is a "Lead" stage, we should show the Lead detail page.
    // If no project is selected, show the master List of Leads.
    const [mode, setMode] = useState<'list' | 'detail'>(selectedProjectId ? 'detail' : 'list');
    
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Sync mode with global states
    useEffect(() => {
        if (selectedProjectId) setMode('detail');
        else setMode('list');
    }, [selectedProjectId]);

    const handleClearProject = () => {
        setSelectedProjectId(null);
        setMode('list');
    };

    const handleProjectClick = (projectId: string, stage: string) => {
        setSelectedProjectId(projectId);
        
        const targetPage = getStagePageId(stage);
        
        // If it belongs in E-26, just switch to detail mode here
        if (targetPage === 'E-26') {
            setMode('detail');
        } else {
            // Navigate to the correct page for this specific pipeline stage
            setActivePageId(targetPage);
        }
    };

    const handleViewAccount = (userId: string) => {
        if (!userId || userId === 'unassigned') return;
        setSelectedAccountId(userId);
        setActivePageId('E-08'); // Company Profile
    };

    // --- LIST VIEW LOGIC ---
    
    // Group ONLY lead projects by Account User
    const groupedProjects = useMemo(() => {
        const map = new Map<string, any[]>();
        
        // Filter only projects in the lead stage
        const leadsOnly = projects.filter(p => {
            const cs = (p.current_stage || '').toLowerCase().trim();
            return cs === 'lead' || cs.includes('stage 1');
        });

        leadsOnly.forEach(p => {
            const userId = p.user_id || p.account_id || p.owner_id || 'unassigned';
            if (!map.has(userId)) map.set(userId, []);
            map.get(userId)!.push(p);
        });
        
        return Array.from(map.entries()).map(([userId, userProjects]) => ({
            userId,
            customerName: userProjects[0]?.customer_name || userProjects[0]?.name?.split(' ')[0] + ' Account' || 'Unknown Customer',
            projects: userProjects.sort((a, b) => {
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateB - dateA; // Newest first
            })
        }));
    }, [projects]);


    // --- RENDER DETAIL (LEAD STAGE) ---
    if (mode === 'detail' && selectedProjectId) {
        const currentProject = projects.find(p => p.id === selectedProjectId);
        
        return (
            <PageContainer 
                title="Lead Stage Processing" 
                description="Qualify and dispatch actions for this initial stage."
                headerAction={
                    <Button variant="secondary" onClick={handleClearProject}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Leads List
                    </Button>
                }
            >
                {loading ? (
                    <div className="h-64 bg-gray-900 animate-pulse rounded-xl border border-gray-800" />
                ) : !currentProject ? (
                    <div className="text-center p-20 bg-gray-900 border border-gray-800 rounded-xl">
                        <p className="text-gray-400">Project data could not be found or loaded.</p>
                        <Button className="mt-4" onClick={handleClearProject}>
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Return
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-6">
                            <Card className="flex-1" title="Lead Information">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Project Name</p>
                                        <h2 className="text-2xl font-bold text-white transition-colors">
                                            {currentProject.name || 'Unnamed Project'}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Property Address</p>
                                            <p className="text-sm text-gray-300 mt-1">
                                                {currentProject.property_address || currentProject.property?.address || 'Not Provided'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Project Type</p>
                                            <p className="text-sm text-white font-bold mt-1 uppercase tracking-wider">
                                                {currentProject.project_type || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-800 pt-4">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Stage Status</p>
                                        <span className={cn(
                                            'text-xs px-3 py-1.5 rounded-full border font-black uppercase tracking-wider',
                                            stageBadgeColor(currentProject.current_stage)
                                        )}>
                                            {currentProject.current_stage || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="w-full md:w-80 shrink-0" title="Next Steps">
                                <p className="text-sm text-gray-400 mb-6">
                                    This record is currently in the Intake (Lead) stage. Please assign it to the estimator framework to push it forward.
                                </p>
                                <div className="space-y-3">
                                    <Button 
                                        className="w-full justify-center" 
                                        onClick={() => setActivePageId('E-27')}
                                    >
                                        <CalculatorIcon className="w-5 h-5 mr-2" />
                                        Launch Estimator
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        className="w-full justify-center"
                                        onClick={() => handleViewAccount(currentProject.user_id || currentProject.account_id)}
                                    >
                                        <UserIcon className="w-5 h-5 mr-2" />
                                        View Account
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </PageContainer>
        );
    }

    // --- RENDER LIST ---
    return (
        <PageContainer 
            title="Contacts & Leads Pipeline" 
            description="All acquired leads and projects grouped by account user. Click a record to route to its pipeline stage."
            headerAction={
                <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",
                    loading ? "text-yellow-400 animate-pulse" : "text-green-400"
                )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-400" : "bg-green-400 shadow-[0_0_8px_#4ade80]")} />
                    {loading ? 'Syncing…' : 'Live'}
                </div>
            }
        >
            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : groupedProjects.length === 0 ? (
                    <div className="text-center p-20 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                        <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 text-gray-700 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-400">No projects found</h3>
                        <p className="text-gray-600 mt-2">Projects registered from Customer Input will appear grouped here.</p>
                    </div>
                ) : (
                    groupedProjects.map(group => (
                        <div key={group.userId} className="mb-8">
                            {/* Account Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-900 border border-[#ec028b]/30 flex items-center justify-center text-[#ec028b] shadow-[0_0_15px_rgba(236,2,139,0.1)]">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-wide">
                                        Account: {group.userId === 'unassigned' ? 'Unassigned' : group.customerName}
                                    </h2>
                                    <p className="text-xs text-gray-500 font-mono">ID: {group.userId} • {group.projects.length} Active Jobs</p>
                                </div>
                            </div>
                            
                            {/* Project Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.projects.map(project => (
                                    <Card 
                                        key={project.id} 
                                        onClick={() => handleProjectClick(project.id, project.current_stage || 'lead')}
                                        className="cursor-pointer hover:border-[#ec028b] hover:shadow-[0_0_20px_rgba(236,2,139,0.1)] transition-all group p-5 bg-gray-900/40"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="min-w-0 pr-4">
                                                <h3 className="text-white font-bold text-lg truncate group-hover:text-[#ec028b] transition-colors">
                                                    {project.name || 'Unnamed Project'}
                                                </h3>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                                                    <span className="truncate">
                                                        {project.property_address || project.property?.address || 'Location Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-gray-700 flex items-center justify-center group-hover:bg-[#ec028b] group-hover:border-[#ec028b] group-hover:text-white transition-all text-gray-500">
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
                                            <span className={cn(
                                                'text-[10px] px-2 py-1 rounded border font-black uppercase tracking-wider',
                                                stageBadgeColor(project.current_stage)
                                            )}>
                                                {project.current_stage || 'Lead'}
                                            </span>
                                            
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'New'}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </PageContainer>
    );
};

export default LeadPage;