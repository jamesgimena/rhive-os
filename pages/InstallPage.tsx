
import React from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon } from '../components/icons';

const InstallContent: React.FC<{ project: any }> = ({ project }) => {
    const tasks = [
        { label: 'Tear-off Complete', done: true },
        { label: 'Decking Inspected', done: true },
        { label: 'Underlayment', done: false, active: true },
        { label: 'Shingle Installation', done: false },
        { label: 'Final Cleanup', done: false },
    ];
    const doneCount = tasks.filter(t => t.done).length;
    const pct = Math.round((doneCount / tasks.length) * 100);

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Installation Progress">
                        {/* Progress bar */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Overall Progress</span>
                                <span className="text-[#ec028b] font-bold font-mono text-sm">{pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#ec028b] to-pink-400 rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div key={task.label} className={`flex items-center gap-3 p-3 rounded-lg border ${task.done ? 'border-green-500/20 bg-green-500/5' : task.active ? 'border-yellow-500/30 bg-yellow-500/5 animate-pulse' : 'border-gray-800 bg-gray-900/30'}`}>
                                    <div className={`w-5 h-5 rounded-full flex-none flex items-center justify-center border ${task.done ? 'bg-green-500/20 border-green-500/40' : task.active ? 'border-yellow-500/60' : 'border-gray-700'}`}>
                                        {task.done && <CheckIcon className="w-3 h-3 text-green-400" />}
                                    </div>
                                    <span className={`text-sm font-medium ${task.done ? 'text-gray-500 line-through' : task.active ? 'text-yellow-300' : 'text-gray-400'}`}>
                                        {task.label}
                                        {task.active && <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-yellow-500">In Progress</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Crew Photo Uploads">
                        <div className="grid grid-cols-3 gap-3 h-32">
                            <div className="bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-600 text-xs">Photo 1</div>
                            <div className="bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center text-gray-600 text-xs">Photo 2</div>
                            <div className="bg-gray-800 rounded-lg border border-dashed border-gray-700 flex items-center justify-center text-gray-600 text-xs cursor-pointer hover:border-[#ec028b]/50">+ Add</div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Project Info">
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Project</p>
                                <p className="text-white font-bold">{project.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Type</p>
                                <p className="text-white">{project.project_type || '—'}</p>
                            </div>
                            {project.quote?.total && (
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Contract Value</p>
                                    <p className="text-[#ec028b] font-mono font-bold">${project.quote.total.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Additional Work Orders">
                        <p className="text-gray-500 text-sm mb-3">No AWOs for this project yet.</p>
                        <Button variant="secondary" className="w-full">Create AWO</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const InstallPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Install" stagePageId="E-32">
        {(project) => <InstallContent project={project} />}
    </ProjectStageLayout>
);

export default InstallPage;