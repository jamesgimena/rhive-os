import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';

const EstimatePage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-19');

    const estimates = [
        { name: 'John Doe', address: '123 Maple St', status: 'sent' },
        { name: 'Jane Smith', address: '456 Oak Ave', status: 'viewed' },
    ];

    return (
        <PageContainer title="Pipeline - Estimate Stage" description={page?.description || 'Manage leads with ballpark estimates.'}>
            <Card>
                <ul className="divide-y divide-gray-700">
                    {estimates.map(est => (
                        <li key={est.name} className="p-4 flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <p className="font-semibold text-white">{est.name}</p>
                                <p className="text-sm text-gray-400">{est.address}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                                <StatusBadge status={est.status as any} />
                                <Button variant="secondary" size="sm">Follow Up</Button>
                                <Button size="sm">Create Quote</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </PageContainer>
    );
};

export default EstimatePage;