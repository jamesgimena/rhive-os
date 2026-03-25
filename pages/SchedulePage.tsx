
import React, { useState } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentCheckIcon, UserIcon, TruckIcon, PlusIcon, ChevronRightIcon } from '../components/icons';

const LogicGate = ({ title, isMet, icon: Icon, actionLabel }: { title: string; isMet: boolean; icon: any; actionLabel: string }) => (
    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${isMet ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-900/50 border-gray-700'}`}>
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isMet ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className={`font-bold ${isMet ? 'text-green-400' : 'text-white'}`}>{title}</h4>
                <p className="text-xs text-gray-400">{isMet ? 'Requirement Met' : 'Required to Advance'}</p>
            </div>
        </div>
        {!isMet ? (
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                {actionLabel}
            </Button>
        ) : (
            <DocumentCheckIcon className="w-6 h-6 text-green-500" />
        )}
    </div>
);

const ScheduleContent: React.FC<{ project: any }> = ({ project }) => {
    const [reqs, setReqs] = useState({ permit: true, materials: false, labor: true });
    const canAdvance = Object.values(reqs).every(Boolean);

    return (
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Stage Logic Gates: Requirements to Advance">
                        <div className="space-y-4">
                            <LogicGate title="Permit Status: Approved" isMet={reqs.permit} icon={DocumentCheckIcon} actionLabel="Upload Permit" />
                            <LogicGate title="Material Order: Confirmed" isMet={reqs.materials} icon={TruckIcon} actionLabel="Create PO" />
                            <LogicGate title="Labor Assignment: Crew Accepted" isMet={reqs.labor} icon={UserIcon} actionLabel="Assign Crew" />
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                            <div className="text-sm text-gray-400">
                                Logic Check: {canAdvance
                                    ? <span className="text-green-400 font-bold">PASS</span>
                                    : <span className="text-red-400 font-bold">BLOCKED</span>}
                            </div>
                            <Button disabled={!canAdvance} className={`flex items-center gap-2 ${!canAdvance ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Advance to Pre-Installation
                                <ChevronRightIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </Card>

                    <Card title="Installation Calendar">
                        <div className="h-52 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-800">
                            <p className="text-gray-500">Calendar View (Syncs with Google/Outlook)</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Project Context">
                        <h3 className="font-bold text-white mb-1">{project.name}</h3>
                        <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                            {project.project_type || 'N/A'}
                        </span>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Stage</span>
                                <span className="text-white">{project.current_stage}</span>
                            </div>
                            {project.quote?.total && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Quote Value</span>
                                    <span className="text-[#ec028b] font-mono font-bold">${project.quote.total.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SchedulePage: React.FC = () => (
    <ProjectStageLayout stageLabel="Schedule" stagePageId="E-30">
        {(project) => <ScheduleContent project={project} />}
    </ProjectStageLayout>
);

export default SchedulePage;
