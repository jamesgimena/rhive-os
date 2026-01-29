import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';

const PropertyProjectsPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-14');
    
    const projects = [
        { id: 'PROJ-001', name: 'Full Roof Replacement', date: '2023-05-15', status: 'completed' },
        { id: 'PROJ-002', name: 'Gutter Installation', date: '2023-05-20', status: 'completed' },
        { id: 'PROJ-003', name: 'Annual Inspection', date: '2024-06-01', status: 'in-progress' },
    ];

    return (
        <PageContainer title="Projects for 123 Maple St" description={page?.description || 'Manage projects for this property.'}>
            <div className="flex justify-end mb-4">
                <Button>Add New Project</Button>
            </div>
            <div className="space-y-4">
                {projects.map(project => (
                    <Card key={project.id}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">{project.name}</h3>
                                <p className="text-sm text-gray-400">Project ID: {project.id} | Date: {project.date}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                                <StatusBadge status={project.status as any} />
                                <Button variant="secondary" size="sm">View Details</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </PageContainer>
    );
};

export default PropertyProjectsPage;