
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import CollapsibleSection from '../components/CollapsibleSection';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { BoltIcon, UserIcon, BuildingStorefrontIcon, BriefcaseIcon } from '../components/icons';

const SimulationGuidePage: React.FC = () => {
    const { currentUser } = useMockDB();

    const renderEmployeeGuide = () => (
        <div className="space-y-6">
            <Card title="🧪 Employee Simulation Scenarios" className="border-[#ec028b]">
                <p className="text-gray-300 mb-4">
                    Use the <strong>Global Nav - Customer Lookup</strong> (top right dispatch button) as your starting point for all simulations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-[#ec028b] mb-2">1. The Government Logic Check</h3>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            <li>Go to Global Search.</li>
                            <li>Search for <strong>"Hill AFB"</strong>.</li>
                            <li>Click the Project "Hangar 42 Security Upgrade".</li>
                            <li>It will take you to the <strong>Estimate Tool</strong>.</li>
                            <li>Notice the "Compliance" tab is now visible (Gov only).</li>
                            <li>Navigate to <strong>Schedule (Stage 4)</strong> via menu.</li>
                            <li>Observe that progress is <strong>BLOCKED</strong> due to missing Wage Determination.</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-[#ec028b] mb-2">2. The Commercial Stop</h3>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            <li>Go to Global Search.</li>
                            <li>Search for <strong>"Megaplex"</strong>.</li>
                            <li>Click the Property or Project.</li>
                            <li>Try to run an Instant Estimate.</li>
                            <li>Observe the <strong>"Commercial Stop"</strong> logic that forces a Site Assessment instead of a price.</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-[#ec028b] mb-2">3. The "Quote to Cash" Flow</h3>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            <li>Search for <strong>"Thompson"</strong> (Residential).</li>
                            <li>Open the Project.</li>
                            <li>Go to <strong>Quote Builder (E-06)</strong>.</li>
                            <li>Click "Publish to Customer Portal".</li>
                            <li>Log out {'->'} Log in as <strong>Customer</strong>.</li>
                            <li>You will see the quote waiting for approval.</li>
                        </ul>
                    </div>

                     <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-[#ec028b] mb-2">4. Creating New Data</h3>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            <li>Go to Global Search.</li>
                            <li>Click the <strong>+</strong> button on "Properties".</li>
                            <li>Add a new address.</li>
                            <li>Or click <strong>New Lead</strong> on Homepage.</li>
                            <li>Fill out the "Customer Input Form".</li>
                            <li>Submit to see it appear in the <strong>Lead Pipeline (E-18)</strong>.</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderCustomerGuide = () => (
        <div className="space-y-6">
            <Card title="🧪 Customer Portal Testing">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-green-400 mb-2">Approve a Quote</h3>
                        <p className="text-sm text-gray-400 mb-2">
                            To test this, ensure the "Thompson Roof Replacement" project is in the <strong>Quote</strong> stage.
                        </p>
                        <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                            <li>Go to your <strong>Dashboard</strong>.</li>
                            <li>You should see "Action Required: Thompson Roof Replacement".</li>
                            <li>Review the line items.</li>
                            <li>Click <strong>Approve & Schedule</strong>.</li>
                            <li>The status changes to "Approved" and the Employee sees it move to "Sign & Verify".</li>
                        </ol>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderContractorGuide = () => (
        <div className="space-y-6">
             <Card title="🧪 Contractor Portal Testing">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-yellow-400 mb-2">Accepting Jobs</h3>
                        <p className="text-sm text-gray-400 mb-2">
                            Contractors only see jobs that have passed the "Sign & Verify" stage.
                        </p>
                        <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                            <li>Go to <strong>Contractor Homepage</strong>.</li>
                            <li>Look for "Willow Park Gutter Repair" (It is in 'Schedule' stage).</li>
                            <li>Click "View Job Details" to simulate accepting the schedule.</li>
                            <li>Go to <strong>New Project Bids</strong> to see open tenders.</li>
                        </ol>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSupplierGuide = () => (
        <div className="space-y-6">
             <Card title="🧪 Supplier Portal Testing">
                 <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-blue-400 mb-2">Bidding on Material Lists</h3>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                        <li>Go to <strong>Supplier Homepage</strong>.</li>
                        <li>View "Projects Open for Bidding".</li>
                        <li>These populate based on Projects in 'Estimate' or 'Quote' stage that need material pricing.</li>
                    </ul>
                </div>
            </Card>
        </div>
    );

    const renderContent = () => {
        switch (currentUser?.role) {
            case 'Employee': return renderEmployeeGuide();
            case 'Customer': return renderCustomerGuide();
            case 'Contractor': return renderContractorGuide();
            case 'Supplier': return renderSupplierGuide();
            default: return <div className="text-white">Please log in to view the guide.</div>;
        }
    };

    return (
        <PageContainer title="Simulation Guide" description="How to test the RHIVE Platform Logic Flows.">
            {renderContent()}

            <div className="mt-8">
                <CollapsibleSection title="General Navigation Tips" isOpen={true}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800">
                            <BoltIcon className="w-5 h-5 mr-2 text-yellow-500" />
                            <span>Use <strong>Global Search</strong> (Top Right) to jump between contexts.</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800">
                            <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                            <span><strong>Logout</strong> to switch roles (Employee {'->'} Customer).</span>
                        </div>
                         <div className="flex items-center p-3 bg-gray-900 rounded border border-gray-800">
                            <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-green-500" />
                            <span>Data persists in <strong>Session Memory</strong> (refreshes reset it).</span>
                        </div>
                    </div>
                </CollapsibleSection>
            </div>
        </PageContainer>
    );
};

export default SimulationGuidePage;
