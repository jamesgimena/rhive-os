import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const InstallPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-24');

    return (
        <PageContainer title="Pipeline - Installation" description={page?.description || 'Track live installation progress.'}>
            <Card title="Project: Henderson Residence">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Progress Checklist</h3>
                        <ul className="space-y-2">
                            <li className="text-green-400">✓ Tear-off Complete</li>
                            <li className="text-green-400">✓ Decking Inspected</li>
                            <li className="text-yellow-400 animate-pulse">In Progress: Underlayment</li>
                            <li className="text-gray-500">Pending: Shingle Installation</li>
                            <li className="text-gray-500">Pending: Final Cleanup</li>
                        </ul>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Crew Photo Uploads</h3>
                        <div className="grid grid-cols-3 gap-2 h-32">
                           <div className="bg-gray-700 rounded-md"></div>
                           <div className="bg-gray-700 rounded-md"></div>
                           <div className="bg-gray-700 rounded-md"></div>
                        </div>
                    </div>
                     <div className="md:col-span-3 border-t border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-white">Additional Work Orders (AWOs)</h3>
                        <p className="text-gray-400 text-sm mb-3">No AWOs for this project yet.</p>
                        <Button variant="secondary">Create AWO</Button>
                    </div>
                </div>
            </Card>
        </PageContainer>
    );
};

export default InstallPage;