
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { useMockDB } from '../contexts/MockDatabaseContext';

const CompanyPage: React.FC = () => {
    const { users, getUserProjects } = useMockDB();
    // Simulate viewing a specific company (Willow Park HOA)
    const companyUser = users.find(u => u.name === 'Willow Park HOA');
    const projects = companyUser ? getUserProjects(companyUser.id) : [];

    if (!companyUser) return <div>Company not found in simulation.</div>;

    return (
        <PageContainer title={companyUser.name} description="Corporate Client Profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Card title="Company Information">
                        <p className="text-gray-400">{companyUser.email}</p>
                        <p className="text-gray-400">Type: {companyUser.role}</p>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <CollapsibleSection title="Active Projects" isOpen={true}>
                        <ul className="space-y-2 p-2">
                            {projects.map(p => (
                                <li key={p._id} className="text-gray-300 p-3 bg-gray-900/50 rounded-md flex justify-between">
                                    <span>{p.name}</span>
                                    <span className="text-[#ec028b]">{p.current_stage}</span>
                                </li>
                            ))}
                        </ul>
                    </CollapsibleSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default CompanyPage;
