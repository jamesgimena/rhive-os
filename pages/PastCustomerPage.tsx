import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const PastCustomerPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-29');

    return (
        <PageContainer title="Past Customer: John Doe" description={page?.description || 'Manage long-term customer relationships.'}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card title="Project History">
                        <ul className="space-y-2">
                            <li className="text-gray-300">2023-05-15: Full Roof Replacement</li>
                        </ul>
                    </Card>
                </div>
                <div>
                     <Card title="Actions">
                        <div className="space-y-3">
                           <Button className="w-full">Add Referral</Button>
                           <Button variant="secondary" className="w-full">Schedule Annual Inspection</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default PastCustomerPage;