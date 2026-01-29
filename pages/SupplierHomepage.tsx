import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const SupplierHomepage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'S-01');

    const openBids = [
        { name: 'Henderson Residence', closeDate: '2024-07-30' },
        { name: 'Galleria Mall Roof', closeDate: '2024-08-05' },
    ];
    
    return (
        <PageContainer title="Supplier Portal" description="Welcome, ABC Supply!">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Projects Open for Bidding">
                         <div className="space-y-4">
                            {openBids.map(bid => (
                                <div key={bid.name} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                    <div>
                                        <p className="font-semibold text-white">{bid.name}</p>
                                        <p className="text-sm text-gray-400">Bidding closes: {bid.closeDate}</p>
                                    </div>
                                    <Button>View & Bid</Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card title="Performance">
                     <p className="text-gray-400">Analytics on bid win/loss ratio and project completion statistics will be displayed here.</p>
                </Card>

                <div className="lg:col-span-3">
                    <Card title="Project History">
                        <p className="text-gray-400">A searchable and filterable table of past projects, including bids won and lost, will be available here.</p>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default SupplierHomepage;