
import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PencilSquareIcon } from '../components/icons';

const QuotePricingPage: React.FC = () => {
    return (
        <PageContainer title="Quote Builder Pricing" description="Manage line item costs, global margins, and tax rates for the Quote Builder tool.">
            <div className="space-y-6">
                <Card title="Global Settings">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Default Profit Margin (%)</label>
                            <input type="number" className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" defaultValue="20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Sales Tax Rate (%)</label>
                            <input type="number" className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" defaultValue="7.25" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Overhead Markup (%)</label>
                            <input type="number" className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" defaultValue="15" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button>Save Global Settings</Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Labor Rates">
                        <div className="space-y-3">
                            {['General Labor', 'Foreman', 'Specialist', 'Travel Fee'].map(role => (
                                <div key={role} className="flex justify-between items-center p-3 bg-gray-900/50 rounded border border-gray-800">
                                    <span className="text-gray-300">{role}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-white">$65.00/hr</span>
                                        <button className="text-gray-500 hover:text-[#ec028b]"><PencilSquareIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Material Markups">
                        <div className="space-y-3">
                            {['Shingles (Asphalt)', 'Membrane (TPO)', 'Wood/Decking', 'Metals/Flashing'].map(item => (
                                <div key={item} className="flex justify-between items-center p-3 bg-gray-900/50 rounded border border-gray-800">
                                    <span className="text-gray-300">{item}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-white">1.25x</span>
                                        <button className="text-gray-500 hover:text-[#ec028b]"><PencilSquareIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default QuotePricingPage;
