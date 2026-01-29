import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { PAGE_GROUPS } from '../constants';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { CircuitryBackground } from '../components/CircuitryBackground';

const InvoicingPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-26');
    const { projects } = useMockDB();
    const [status, setStatus] = useState('pending');

    // Filter for projects in 'Invoicing' stage
    const invoicingProjects = projects.filter(p => p.current_stage === 'Invoicing');

    const handleSendReminder = () => {
        alert("Reminder sent via email and SMS!");
    };

    const handleProcessPayment = () => {
        setStatus('paid');
        alert("Payment processed successfully. Project moved to Completed.");
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            <CircuitryBackground />
            <div className="relative z-20 flex-1 overflow-y-auto p-6 md:p-10">
                <PageContainer title="Pipeline - Invoicing" description={page?.description || 'Manage final invoices and payments.'}>
                    {invoicingProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 font-mono">No projects currently in 'Invoicing' stage.</p>
                        </div>
                    ) : (
                        invoicingProjects.map(project => (
                            <Card key={project._id} title={`Project: ${project.name} - Final Invoice`} className="mb-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="text-center md:text-left">
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Final 10% Due</p>
                                        <p className="text-5xl font-black text-white mb-2 tracking-tighter">
                                            ${((project.quote?.total || 15000) * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <StatusBadge status={status as any} />
                                    </div>
                                    <div className="flex flex-col justify-center space-y-3">
                                        <div className="bg-gray-900/50 p-4 rounded border border-gray-800">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Total Project Value</span>
                                                <span className="text-white font-mono">${(project.quote?.total || 15000).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Paid to Date (90%)</span>
                                                <span className="text-white font-mono">${((project.quote?.total || 15000) * 0.9).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end space-x-4">
                                    <Button variant="secondary" onClick={handleSendReminder}>Send Reminder</Button>
                                    <Button onClick={handleProcessPayment}>Process Final Payment</Button>
                                </div>
                            </Card>
                        ))
                    )}
                </PageContainer>
            </div>
        </div>
    );
};

export default InvoicingPage;