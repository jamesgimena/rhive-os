
import React from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentDuplicateIcon, DocumentCheckIcon, CalculatorIcon } from '../components/icons';

const CompletedContent: React.FC<{ project: any }> = ({ project }) => {
    // Generate dummy internal profit data
    const quoteTotal = project.quote?.total || 15000;
    const internalMargin = quoteTotal * 0.2; // Assuming 20% margin

    return (
        <div className="p-6 md:p-8 space-y-6">
            <Card title={`Project Conclusion: ${project.name}`}>
                <div className="flex flex-col md:flex-row items-center gap-6 p-4">
                    <div className="flex-none w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
                        <DocumentCheckIcon className="w-10 h-10 text-green-400 drop-shadow-[0_0_8px_#4ade80]" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-wider">Project Complete</h3>
                        <p className="text-gray-400 mt-2 text-sm max-w-lg leading-relaxed">
                            {project.name} has successfully passed all stages, payments have cleared, and documentation is finalized. The warranty period begins now.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Documentation Transfer">
                        <div className="flex flex-col gap-3">
                            <Button size="lg" className="w-full flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(236,2,139,0.2)]">
                                <DocumentDuplicateIcon className="w-5 h-5" />
                                Download Completion Packet
                            </Button>
                            <p className="text-center text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-2">
                                Includes Warranty Docs, Final Invoice, & Certificates
                            </p>
                        </div>
                    </Card>

                    <Card title="Internal Profitability Report" className="bg-gray-900/60 shadow-inner">
                        <div className="p-4 border border-gray-800 rounded-lg bg-black/50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl mix-blend-screen" />
                            <div className="flex justify-between items-center z-10 relative">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                        <CalculatorIcon className="w-3 h-3" />
                                        Final Profit Margin
                                    </p>
                                    <p className="text-2xl font-black text-green-400 font-mono tracking-tighter">
                                        +${internalMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-black text-3xl font-mono">20%</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
};

const CompletedPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Completed" stagePageId="E-36">
        {(project) => <CompletedContent project={project} />}
    </ProjectStageLayout>
);

export default CompletedPage;