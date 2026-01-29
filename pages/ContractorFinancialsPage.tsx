import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';

const ContractorFinancialsPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'CO-03');
    
    const payments = [
        { project: 'Henderson Residence', amount: '$5,000.00', status: 'paid' },
        { project: 'Galleria Mall', amount: '$3,200.00', status: 'processing' },
    ];

    return (
        <PageContainer title="Contractor Financials" description={page?.description || 'View your payment history and earnings.'}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Year-to-Date Earnings">
                    <p className="text-4xl font-bold text-green-400">$87,500.00</p>
                </Card>
                <div className="md:col-span-2">
                    <Card title="Recent Payments">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700 text-sm text-gray-400">
                                    <th className="p-2">Project</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.project} className="border-b border-gray-800">
                                        <td className="p-2 text-white">{p.project}</td>
                                        <td className="p-2 font-mono text-white">{p.amount}</td>
                                        <td className="p-2 text-right"><StatusBadge status={p.status as any} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default ContractorFinancialsPage;