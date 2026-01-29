import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { MapPinIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const PropertyPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-13');

    return (
        <PageContainer title="123 Maple St, Denver, CO" description="Residential Property Profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Location">
                        <div className="h-80 bg-gray-700 rounded-lg flex items-center justify-center">
                            <MapPinIcon className="w-16 h-16 text-gray-500" />
                            <p className="absolute text-gray-400">Map Placeholder</p>
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card title="Property Details">
                        <p className="text-gray-400">Details like roof type, age, and square footage would appear here.</p>
                    </Card>
                    <Card title="Associated Contacts">
                        <ul className="space-y-2">
                            <li className="font-semibold text-white">John Doe (Homeowner)</li>
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <CollapsibleSection title="Project History">
                        <p className="text-gray-400 p-4">A list of all past and current projects for this property would be displayed here.</p>
                    </CollapsibleSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default PropertyPage;