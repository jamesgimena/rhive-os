
import React from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckIcon, ClockIcon } from '../components/icons';

const PreInstallContent: React.FC<{ project: any }> = ({ project }) => (
    <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Scheduled Communications">
                <ul className="space-y-3">
                    {[
                        { label: '3-Day Prep Reminder', status: 'sent' },
                        { label: 'Day Before Install Video', status: 'queued' },
                        { label: 'Weather Advisory Alert', status: 'pending' },
                    ].map((item) => (
                        <li key={item.label} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                            <span className="text-gray-300 text-sm">{item.label}</span>
                            <span className={
                                item.status === 'sent' ? 'text-green-400 text-[10px] font-black uppercase tracking-wider'
                                : item.status === 'queued' ? 'text-yellow-400 text-[10px] font-black uppercase tracking-wider'
                                : 'text-gray-600 text-[10px] font-black uppercase tracking-wider'
                            }>
                                {item.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Card title="Prep Checklist">
                <div className="space-y-3">
                    {[
                        { task: 'Customer prep guide acknowledged', done: true },
                        { task: 'Materials delivered to site', done: false },
                        { task: 'Crew briefing complete', done: true },
                        { task: 'Safety equipment staged', done: false },
                    ].map((item) => (
                        <div key={item.task} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-none ${item.done ? 'bg-green-500/20 border-green-500/40' : 'border-gray-700'}`}>
                                {item.done && <CheckIcon className="w-3 h-3 text-green-400" />}
                            </div>
                            <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                {item.task}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Project Summary" className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Project</p>
                        <p className="text-sm text-white font-bold truncate">{project.name}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Type</p>
                        <p className="text-sm text-white font-bold">{project.project_type || '—'}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Stage</p>
                        <p className="text-sm text-white font-bold">{project.current_stage}</p>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Value</p>
                        <p className="text-sm text-[#ec028b] font-bold font-mono">
                            {project.quote?.total ? `$${project.quote.total.toLocaleString()}` : '—'}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Advance to Install
                    </Button>
                </div>
            </Card>
        </div>
    </div>
);

const PreInstallationPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Pre-Install" stagePageId="E-31">
        {(project) => <PreInstallContent project={project} />}
    </ProjectStageLayout>
);

export default PreInstallationPage;