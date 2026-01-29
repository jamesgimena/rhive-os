import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';

const PaymentsModularPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-27');

    return (
        <PageContainer title={page?.name || 'Payments Module'} description={page?.description || 'A reusable component for payment processing.'}>
             <Card title="Component Preview: Payment Form">
                <p className="text-gray-400 mb-4">This component can be embedded wherever a payment needs to be taken (e.g., Quote, Sign & Verify, Invoicing stages).</p>
                <div className="p-4 border border-dashed border-gray-600 rounded-lg">
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Card Number</label>
                            <div className="mt-1 p-3 bg-gray-900/50 border border-gray-700 rounded-md text-gray-500">XXXX XXXX XXXX 1234</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-sm font-medium text-gray-300">Expiry Date</label>
                                <div className="mt-1 p-3 bg-gray-900/50 border border-gray-700 rounded-md text-gray-500">MM / YY</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300">CVC</label>
                                <div className="mt-1 p-3 bg-gray-900/50 border border-gray-700 rounded-md text-gray-500">123</div>
                            </div>
                        </div>
                        <div className="pt-2">
                             <Button className="w-full">Pay Now</Button>
                        </div>
                    </form>
                </div>
            </Card>
        </PageContainer>
    );
};

export default PaymentsModularPage;