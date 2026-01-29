import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { MapPinIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const CustomerProjectMapPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-31');

    return (
        <PageContainer title={page?.name || 'Customer Project Map'} description={page?.description || 'A map of all completed projects.'}>
            <Card title="RHIVE Projects - Nationwide">
                <div className="h-[60vh] bg-gray-700 rounded-lg flex items-center justify-center relative">
                    <MapPinIcon className="w-24 h-24 text-gray-600" />
                    <p className="absolute text-gray-400">Full-screen interactive map placeholder</p>
                    
                    {/* Mock pins */}
                    <div className="absolute top-1/2 left-1/3">
                        <MapPinIcon className="w-6 h-6 text-[#ec028b]" />
                    </div>
                     <div className="absolute top-1/3 left-1/2">
                        <MapPinIcon className="w-6 h-6 text-[#ec028b]" />
                    </div>
                    <div className="absolute top-2/3 left-2/3">
                        <MapPinIcon className="w-6 h-6 text-[#ec028b]" />
                    </div>
                </div>
            </Card>
        </PageContainer>
    );
};

export default CustomerProjectMapPage;