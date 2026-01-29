
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { CalendarDaysIcon, MapPinIcon, CameraIcon, WrenchIcon, BoltIcon } from '../components/icons';
import { cn } from '../lib/utils';

const ContractorHomepage: React.FC = () => {
    const { getUserProjects, currentUser } = useMockDB();
    const projects = currentUser ? getUserProjects(currentUser.id) : [];

    // Filter for jobs ready for work (Schedule or later)
    const activeJobs = projects.filter(p =>
        ['Schedule', 'Pre-Installation', 'Install', 'Punch List'].includes(p.current_stage)
    );

    return (
        <PageContainer title="FIELD COMMAND" description="High-intensity interface for active crew deployments.">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* LARGE ACTION BUTTONS (FOR FIELD) */}
                <div className="lg:col-span-1 space-y-4">
                    <button className="w-full bg-[#ec028b] text-white py-12 flex flex-col items-center justify-center gap-4 shadow-[0_0_30px_rgba(236,2,139,0.4)] transition-transform active:scale-95"
                        style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
                        <CameraIcon className="w-12 h-12" />
                        <span className="font-black text-xl uppercase tracking-widest">Job Photo</span>
                    </button>
                    <button className="w-full bg-blue-900/40 border-2 border-blue-500/50 text-white py-12 flex flex-col items-center justify-center gap-4 transition-transform active:scale-95"
                        style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
                        <WrenchIcon className="w-12 h-12" />
                        <span className="font-black text-xl uppercase tracking-widest">Update Task</span>
                    </button>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card title="CURRENT DEPLOYMENTS">
                        {activeJobs.length > 0 ? (
                            <div className="space-y-4">
                                {activeJobs.map(project => (
                                    <div key={project._id} className="bg-black border-2 border-gray-800 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#ec028b] transition-all"
                                        style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
                                        <div>
                                            <h4 className="font-black text-white text-3xl italic uppercase tracking-tighter">{project.name}</h4>
                                            <div className="flex items-center text-gray-500 text-sm mt-3 font-mono">
                                                <MapPinIcon className="w-4 h-4 mr-2" /> {project.address}
                                            </div>
                                            <div className="mt-6 flex gap-3">
                                                <span className="px-6 py-2 bg-[#ec028b]/20 text-[#ec028b] border border-[#ec028b]/40 font-black text-[10px] uppercase tracking-widest">{project.current_stage}</span>
                                                <span className="px-6 py-2 bg-gray-900 text-gray-400 border border-gray-800 font-black text-[10px] uppercase tracking-widest">Crew #04</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <Button size="lg" className="w-full bg-white text-black font-black uppercase tracking-widest">VIEW JOB PACK</Button>
                                            <Button size="lg" variant="secondary" className="w-full">CLOCK IN</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-950/50 border border-dashed border-gray-800" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
                                <BoltIcon className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                <p className="text-gray-500 font-black uppercase tracking-widest">No Active Deployments</p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-4 pt-4">
                    <Card title="FIELD ALERTS">
                        <div className="space-y-4 font-black uppercase text-[10px] tracking-widest">
                            <div className="text-gold flex gap-2">
                                <div className="h-4 w-1 bg-gold animate-pulse" />
                                Material Delay: Asphalt Shingles (S-04)
                            </div>
                            <div className="text-blue-400 flex gap-2">
                                <div className="h-4 w-1 bg-blue-400" />
                                Weather Alert: Wind &gt; 25mph expected @ 2PM
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default ContractorHomepage;
