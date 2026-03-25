
import React from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { DocumentCheckIcon, PencilSquareIcon, ClockIcon } from '../components/icons';

const SignAndVerifyContent: React.FC<{ project: any }> = ({ project }) => (
    <div className="p-6 md:p-8 space-y-6">
        <Card title="Contract & Signature Status">
            <div className="flex items-start gap-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <ClockIcon className="w-10 h-10 text-amber-400 flex-none mt-1" />
                <div>
                    <h3 className="font-bold text-white text-lg">{project.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                        This project is awaiting customer signature and initial deposit confirmation before advancing to the scheduling stage.
                    </p>
                    {project.quote?.total && (
                        <p className="text-[#ec028b] font-mono font-bold mt-3 text-lg">
                            Contract Value: ${project.quote.total.toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Signature Verification">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="text-gray-300 text-sm">Digital Contract</span>
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Pending</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                        <span className="text-gray-300 text-sm">Customer ID Verify</span>
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Pending</span>
                    </div>
                    <Button className="w-full flex items-center justify-center gap-2">
                        <PencilSquareIcon className="w-4 h-4" />
                        Send DocuSign Link
                    </Button>
                </div>
            </Card>

            <Card title="Deposit Confirmation">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Required Deposit (10%)</p>
                        <p className="text-2xl font-bold text-white font-mono">
                            ${project.quote?.total ? (project.quote.total * 0.1).toLocaleString() : '—'}
                        </p>
                    </div>
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <DocumentCheckIcon className="w-4 h-4" />
                        Confirm Payment Received
                    </Button>
                </div>
            </Card>
        </div>
    </div>
);

const SignAndVerifyPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Sign & Verify" stagePageId="E-29">
        {(project) => <SignAndVerifyContent project={project} />}
    </ProjectStageLayout>
);

export default SignAndVerifyPage;