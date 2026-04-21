
import React from 'react';
import { ProjectStageLayout } from '../components/ProjectStageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ClockIcon, CalendarIcon, PlusIcon, MegaphoneIcon } from '../components/icons';

const PastCustomerContent: React.FC<{ project: any }> = ({ project }) => {
    return (
        <div className="p-6 md:p-8 space-y-6">
            <Card title={`Account History: ${project.name}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card title="Past Projects" className="shadow-none border border-gray-800 bg-gray-900/40">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-rhive-pink/40 transition-colors">
                                    <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-white text-sm">
                                            {project.project_type || 'Roof Replacement'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
                                            {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Dec 15, 2024'}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right self-center">
                                        <p className="text-[#ec028b] font-mono text-sm font-bold">
                                            ${(project.quote?.total || 15000).toLocaleString()}
                                        </p>
                                        <p className="text-[9px] uppercase tracking-widest text-[#ec028b] bg-[#ec028b]/10 px-2 rounded-full mt-1 border border-[#ec028b]/20">
                                            Completed
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </Card>

                        <div className="mt-6 flex flex-col gap-4">
                            <Button className="w-full flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(236,2,139,0.15)]">
                                <MegaphoneIcon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
                                Request Referral / Review
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card title="Relationship Management" className="bg-gradient-to-br from-black to-gray-900 border border-gray-800">
                            <div className="space-y-4">
                                <Button variant="secondary" className="w-full flex items-center gap-3 justify-center">
                                    <PlusIcon className="w-4 h-4" />
                                    New Pitch / Quote
                                </Button>
                                <Button variant="secondary" className="w-full flex items-center gap-3 justify-center">
                                    <CalendarIcon className="w-4 h-4" />
                                    Schedule ROI Inspection
                                </Button>
                                
                                <div className="p-4 border border-dashed border-gray-700 bg-black/40 rounded-lg mt-4 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                                        Next Follow-up
                                    </p>
                                    <p className="text-white text-sm font-bold">
                                        Spring Maintenance Check
                                    </p>
                                    <p className="text-[#ec028b] text-xs font-mono mt-2">
                                        Mar 01, 2026
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const PastCustomerPage: React.FC = () => (
    <ProjectStageLayout stageLabel="Past Customer" stagePageId="E-37">
        {(project) => <PastCustomerContent project={project} />}
    </ProjectStageLayout>
);

export default PastCustomerPage;