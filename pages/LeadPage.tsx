import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { PAGE_GROUPS } from '../constants';

const LeadCard = ({ name, address }: { name: string, address: string }) => (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-sm cursor-pointer hover:bg-gray-700/50">
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{address}</p>
    </div>
);

const LeadPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-18');

    return (
        <PageContainer title="Sales Pipeline - Leads" description={page?.description || 'Manage new and unqualified leads.'}>
            <div className="flex space-x-4 overflow-x-auto p-2">
                <div className="w-80 bg-gray-900/50 rounded-lg p-3 flex-shrink-0">
                    <h3 className="font-bold text-white mb-3 px-1">New Leads (2)</h3>
                    <div className="space-y-3">
                        <LeadCard name="John Smith" address="456 Oak Ave, Denver, CO" />
                        <LeadCard name="Maria Garcia" address="789 Pine Ln, Aurora, CO" />
                    </div>
                </div>
                {/* Other pipeline stages like "Contacted" could be added here */}
            </div>
        </PageContainer>
    );
};

export default LeadPage;