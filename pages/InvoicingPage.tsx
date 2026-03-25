
import React, { useState } from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { EnvelopeIcon, CreditCardIcon } from '../components/icons';

const InvoicingContent: React.FC<{ project: any }> = ({ project }) => {
    const [status, setStatus] = useState<'pending' | 'paid'>('pending');
    
    // Fallback if quote is not defined
    const quoteTotal = project.quote?.total || 15000;
    const finalPayment = quoteTotal * 0.1; // Assuming 10% final payment
    const paidToDate = quoteTotal - finalPayment;

    const handleSendReminder = () => alert("Reminder sent via email and SMS!");
    const handleProcessPayment = () => {
        setStatus('paid');
        alert("Payment processed successfully. Ready to mark project complete.");
    };

    return (
        <div className="p-6 md:p-8">
            <Card title={`Final Invoice for ${project.name}`}>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center md:text-left flex flex-col justify-center">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-bold">Final Payment Due</p>
                        <p className="text-5xl font-black text-[#ec028b] mb-4 tracking-tighter mix-blend-lighten shadow-[#ec028b]/20 drop-shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                            ${finalPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <StatusBadge status={status} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800 shadow-inner">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Total Contract</span>
                                <span className="text-white font-mono">${quoteTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Paid to Date (90%)</span>
                                <span className="text-white font-mono">${paidToDate.toLocaleString()}</span>
                            </div>
                            <div className="h-px w-full bg-gray-800 my-3" />
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-[#ec028b] uppercase tracking-wider">Remaining Balance</span>
                                <span className="text-[#ec028b] font-mono">${finalPayment.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-4">
                    <Button variant="secondary" onClick={handleSendReminder} className="flex items-center justify-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Send Reminder
                    </Button>
                    <Button 
                        onClick={handleProcessPayment} 
                        disabled={status === 'paid'}
                        className="flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <CreditCardIcon className="w-4 h-4" />
                        {status === 'paid' ? 'Paid in Full' : 'Process Payment'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const InvoicingPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Invoicing" stagePageId="E-34">
        {(project) => <InvoicingContent project={project} />}
    </ProjectStageLayout>
);

export default InvoicingPage;