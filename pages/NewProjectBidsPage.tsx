import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const NewProjectBidsPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'CO-04');

    const bids = [
        { name: 'Smith Residence', location: 'Boulder, CO', price: '$4,500' },
        { name: 'Johnson Commercial', location: 'Denver, CO', price: '$8,000' },
    ];

    return (
        <PageContainer title="New Project Bids" description={page?.description || 'View and accept new project offers.'}>
            <div className="space-y-4">
                {bids.map(bid => (
                    <Card key={bid.name}>
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">{bid.name}</h3>
                                <p className="text-sm text-gray-400">{bid.location}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                                <span className="text-xl font-bold text-[#ec028b]">{bid.price}</span>
                                <Button>Accept Job</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </PageContainer>
    );
};

export default NewProjectBidsPage;