import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';

const PunchListPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-25');
    
    const items = [
        { task: 'Replace cracked shingle on west slope.', assignedTo: 'Jane Smith', status: 'completed' },
        { task: 'Clean out gutters of debris.', assignedTo: 'Jane Smith', status: 'in-progress' },
    ];

    return (
        <PageContainer title="Pipeline - Punch List" description={page?.description || 'Manage and track punch list items to completion.'}>
            <Card title="Project: Henderson Residence">
                <div className="flex justify-end mb-4">
                    <Button>Add Punch List Item</Button>
                </div>
                <ul className="space-y-3">
                    {items.map((item, i) => (
                        <li key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 flex justify-between items-center">
                            <div>
                               <p className="text-white">{item.task}</p>
                               <p className="text-xs text-gray-400">Assigned to: {item.assignedTo}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <StatusBadge status={item.status as any} />
                                <Button variant="secondary" size="sm">Verify Photo</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </PageContainer>
    );
};

export default PunchListPage;