import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';

const SignAndVerifyPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-21');

    const projects = [
        { name: 'Henderson Residence', status: 'pending-signature' },
        { name: 'Galleria Mall', status: 'pending-deposit' },
    ];

    return (
        <PageContainer title="Pipeline - Sign & Verify" description={page?.description || 'Manage project contracts and initial deposits.'}>
             <Card>
                <ul className="divide-y divide-gray-700">
                    {projects.map(p => (
                        <li key={p.name} className="p-4 flex flex-col md:flex-row justify-between md:items-center">
                            <p className="font-semibold text-white">{p.name}</p>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                                <StatusBadge status={p.status as any} />
                                <Button variant="secondary" size="sm">
                                    {p.status === 'pending-signature' ? 'Verify Signature' : 'Confirm Deposit'}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </PageContainer>
    );
};

export default SignAndVerifyPage;