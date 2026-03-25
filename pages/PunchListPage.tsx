
import React, { useState } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { CheckIcon, PlusIcon } from '../components/icons';

const PunchListContent: React.FC<{ project: any }> = ({ project }) => {
    const [items, setItems] = useState([
        { id: 1, task: 'Replace cracked shingle on west slope', assignedTo: 'Jane Smith', status: 'completed' },
        { id: 2, task: 'Clean out gutters of debris', assignedTo: 'Jane Smith', status: 'in-progress' },
        { id: 3, task: 'Touch up paint on fascia board', assignedTo: 'Mark Lee', status: 'pending' },
    ]);

    return (
        <div className="p-6 md:p-8 space-y-6">
            <Card title="Punch List Items">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-400">
                        {items.filter(i => i.status === 'completed').length} of {items.length} tasks completed
                    </p>
                    <Button size="sm" className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Add Task
                    </Button>
                </div>

                <ul className="space-y-3">
                    {items.map((item) => (
                        <li key={item.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-gray-600">
                            <div className="flex items-start gap-4 flex-1">
                                <div className={`mt-1 flex-none w-5 h-5 rounded-full border flex items-center justify-center ${item.status === 'completed' ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'border-gray-700 bg-black'}`}>
                                    {item.status === 'completed' && <CheckIcon className="w-3 h-3" />}
                                </div>
                                <div>
                                    <p className={`font-semibold ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {item.task}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">
                                        Assigned to: {item.assignedTo}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <StatusBadge status={item.status as any} />
                                {item.status !== 'completed' && (
                                    <Button variant="secondary" size="sm" onClick={() => {
                                        setItems(items.map(i => i.id === item.id ? { ...i, status: 'completed' } : i));
                                    }}>
                                        Mark Done
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="flex justify-end p-4 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                <Button 
                    disabled={items.some(i => i.status !== 'completed')}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    All Items Complete — Ready for Invoicing
                </Button>
            </div>
        </div>
    );
};

const PunchListPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Punch-list" stagePageId="E-33">
        {(project) => <PunchListContent project={project} />}
    </ProjectStageLayout>
);

export default PunchListPage;