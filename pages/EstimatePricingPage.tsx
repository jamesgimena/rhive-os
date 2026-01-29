import React from 'react';
import PageContainer from '../components/PageContainer';
import CollapsibleSection from '../components/CollapsibleSection';
import Button from '../components/Button';
import { PencilSquareIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const PricingRow = ({ name, unit, cost }: { name: string, unit: string, cost: string }) => (
    <div className="grid grid-cols-3 items-center p-2 bg-gray-900/50 rounded-md hover:bg-gray-800/50">
        <span className="text-gray-300">{name}</span>
        <span className="text-gray-400">{unit}</span>
        <div className="flex items-center justify-end space-x-2">
            <span className="font-mono text-white">{cost}</span>
            <Button variant="secondary" size="sm" className="!p-2">
                <PencilSquareIcon className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

const EstimatePricingPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-05');

    return (
        <PageContainer title={page?.name || 'Estimate Pricing'} description={page?.description || 'Manage pricing data for estimate calculations.'}>
            <div className="space-y-4">
                <CollapsibleSection title="Materials Pricing">
                    <div className="space-y-2 p-2">
                        <div className="grid grid-cols-3 text-sm font-semibold text-gray-400 px-2">
                            <span>Item</span>
                            <span>Unit</span>
                            <span className="text-right">Cost</span>
                        </div>
                        <PricingRow name="Architectural Shingles" unit="per Square" cost="$120.00" />
                        <PricingRow name="Synthetic Underlayment" unit="per Roll" cost="$85.00" />
                        <PricingRow name="Ice & Water Shield" unit="per Roll" cost="$110.00" />
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Labor Pricing">
                     <div className="space-y-2 p-2">
                        <div className="grid grid-cols-3 text-sm font-semibold text-gray-400 px-2">
                            <span>Task</span>
                            <span>Unit</span>
                            <span className="text-right">Cost</span>
                        </div>
                        <PricingRow name="Shingle Installation" unit="per Square" cost="$90.00" />
                        <PricingRow name="Tear-off (1 Layer)" unit="per Square" cost="$50.00" />
                        <PricingRow name="Decking Replacement" unit="per Sheet" cost="$75.00" />
                    </div>
                </CollapsibleSection>
                 <CollapsibleSection title="Overhead & Profit">
                     <div className="space-y-2 p-2">
                        <div className="grid grid-cols-3 text-sm font-semibold text-gray-400 px-2">
                            <span>Item</span>
                            <span>Type</span>
                            <span className="text-right">Value</span>
                        </div>
                        <PricingRow name="Standard Overhead" unit="Percentage" cost="15%" />
                        <PricingRow name="Standard Profit Margin" unit="Percentage" cost="20%" />
                    </div>
                </CollapsibleSection>
            </div>
        </PageContainer>
    );
};

export default EstimatePricingPage;