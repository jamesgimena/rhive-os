import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const PreInstallationPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-23');

    return (
        <PageContainer title="Pipeline - Pre-Installation" description={page?.description || 'Manage customer communications before installation.'}>
            <Card title="Project: Henderson Residence">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Scheduled Communications</h3>
                        <ul className="space-y-2 list-disc list-inside text-gray-300">
                           <li><span className="font-semibold text-green-400">[SENT]</span> 3-Day Prep Reminder</li>
                           <li><span className="font-semibold text-yellow-400">[QUEUED]</span> Day Before Install Video</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Installation Prep Guide</h3>
                        <p className="text-gray-400 mb-3">Ensure the client has received and acknowledged the prep guide.</p>
                        <Button variant="secondary">View Guide</Button>
                    </div>
                     <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-white mb-3">Weekly Updates</h3>
                        <p className="text-gray-400">Status of the automated Wednesday update email.</p>
                         <p className="font-semibold text-green-400 mt-2">Next update approved and scheduled.</p>
                    </div>
                </div>
            </Card>
        </PageContainer>
    );
};

export default PreInstallationPage;