import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentDuplicateIcon, DocumentCheckIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const CompletedPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-28');

    return (
        <PageContainer title="Pipeline - Completed" description={page?.description || 'Manage final project documentation.'}>
            <Card title="Project: Henderson Residence">
                 <div className="flex items-center p-4">
                    <DocumentCheckIcon className="w-12 h-12 text-green-400 mr-4" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Project Complete</h3>
                        <p className="text-gray-400">All stages, payments, and documentation are finalized.</p>
                    </div>
                </div>
                 <div className="p-4 border-t border-gray-700 space-y-4">
                    <Button size="lg">
                        <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                        Download Completion Packet
                    </Button>
                    <Card title="Internal Profitability Report">
                        <p className="text-gray-400">Final Profit: <span className="font-mono text-green-400">$2,500.00 (20%)</span></p>
                    </Card>
                </div>
            </Card>
        </PageContainer>
    );
};

export default CompletedPage;