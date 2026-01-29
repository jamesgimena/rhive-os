
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { useNavigation } from '../contexts/NavigationContext';
import { 
    UserIcon, 
    CalculatorIcon, 
    DocumentTextIcon, 
    PencilSquareIcon,
    BriefcaseIcon
} from '../components/icons';

const SalesPipelinePage: React.FC = () => {
    const { projects, setCurrentProjectId } = useMockDB();
    const { setActivePageId } = useNavigation();
    const [activeTab, setActiveTab] = useState<'Lead' | 'Estimate' | 'Quote' | 'Sign & Verify'>('Lead');

    const getProjectsByStage = (stage: string) => projects.filter(p => p.current_stage === stage);

    const handleProjectAction = (projectId: string, action: 'estimate' | 'quote' | 'view') => {
        setCurrentProjectId(projectId);
        if (action === 'estimate') setActivePageId('E-EST-TOOL');
        else if (action === 'quote') setActivePageId('E-06');
        else if (action === 'view') setActivePageId('E-G-01');
    };

    const renderProjectCard = (project: any) => (
        <div key={project._id} className="bg-gray-900/50 border border-gray-700 p-5 rounded-xl hover:border-[#ec028b] transition-all duration-300 group shadow-lg">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#ec028b] transition-colors">{project.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{project._id} • {project.last_updated}</p>
                </div>
                <div className="text-gray-300 bg-black/40 border border-gray-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {project.project_type}
                </div>
            </div>
            
            <div className="mb-6 text-sm text-gray-400">
                {activeTab === 'Lead' && "Status: New Opportunity. Needs Qualification."}
                {activeTab === 'Estimate' && "Status: Awaiting AI Analysis."}
                {activeTab === 'Quote' && (
                    <div className="flex items-center">
                        <span>Quote Value: </span>
                        <span className="ml-2 text-white font-bold font-mono">{project.quote?.total ? '$' + project.quote.total.toLocaleString() : 'Drafting...'}</span>
                    </div>
                )}
                {activeTab === 'Sign & Verify' && "Status: Pending Customer Signature."}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-800">
                {activeTab === 'Lead' && (
                    <>
                        <Button size="sm" onClick={() => handleProjectAction(project._id, 'estimate')} className="flex-1">
                            <CalculatorIcon className="w-4 h-4 mr-2" />
                            Estimator
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleProjectAction(project._id, 'view')} className="flex-1">
                            <UserIcon className="w-4 h-4 mr-2" />
                            Profile
                        </Button>
                    </>
                )}
                {activeTab === 'Estimate' && (
                    <>
                        <Button size="sm" onClick={() => handleProjectAction(project._id, 'estimate')} className="flex-1">
                            <CalculatorIcon className="w-4 h-4 mr-2" />
                            Open Tool
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleProjectAction(project._id, 'quote')} className="flex-1">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            Build Quote
                        </Button>
                    </>
                )}
                {activeTab === 'Quote' && (
                    <>
                        <Button size="sm" onClick={() => handleProjectAction(project._id, 'quote')} className="w-full">
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            Edit / Send Quote
                        </Button>
                    </>
                )}
                {activeTab === 'Sign & Verify' && (
                    <Button size="sm" variant="secondary" className="w-full cursor-default border-gray-700 text-gray-500 hover:bg-transparent hover:text-gray-500">
                        Awaiting Signature...
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <PageContainer title="Sales Pipeline" description="Manage customer acquisition from Lead to Contract.">
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 overflow-x-auto pb-1 border-b border-gray-800">
                {['Lead', 'Estimate', 'Quote', 'Sign & Verify'].map((stage) => (
                    <button
                        key={stage}
                        onClick={() => setActiveTab(stage as any)}
                        className={`px-6 py-3 rounded-t-lg text-sm font-bold transition-all duration-200 border-b-2 ${
                            activeTab === stage 
                                ? 'bg-gray-900/80 text-[#ec028b] border-[#ec028b]' 
                                : 'text-gray-500 border-transparent hover:text-white hover:bg-gray-900/30'
                        }`}
                    >
                        {stage} 
                        <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${activeTab === stage ? 'bg-[#ec028b] text-white' : 'bg-gray-800 text-gray-400'}`}>
                            {getProjectsByStage(stage).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Kanban / List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProjectsByStage(activeTab).map(renderProjectCard)}
                
                {getProjectsByStage(activeTab).length === 0 && (
                    <div className="col-span-full p-16 text-center border border-dashed border-gray-800 rounded-xl text-gray-600 bg-gray-900/20">
                        <BriefcaseIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No active projects in {activeTab}</p>
                        <p className="text-sm mt-2">Check Global Dispatch or Create New Intake.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default SalesPipelinePage;
