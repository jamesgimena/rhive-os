import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { PencilSquareIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const LineItemProfilePage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-08');

    return (
        <PageContainer title="Additional Material cost" description="ASPH-MAT-ADD$">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-gray-900/40 relative">
                     <div className="absolute top-4 right-4 flex space-x-2">
                        <Button variant="secondary" size="sm"><PencilSquareIcon className="w-4 h-4 mr-2" /> Edit</Button>
                        <Button variant="secondary" size="sm">X</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-4">
                        <div className="border-r border-gray-700 pr-8">
                             <h3 className="text-xl font-bold text-white mb-6">Item Details</h3>
                             <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Item ID:</p>
                                    <p className="font-mono text-white bg-gray-800 p-2 rounded-md">asph-in-misc-mat-add</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-gray-400">Unit:</p>
                                    <p className="font-mono text-white bg-gray-800 p-2 rounded-md">$</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-gray-400">Category:</p>
                                    <p className="font-mono text-white bg-gray-800 p-2 rounded-md">ASPHALT_INPUT</p>
                                </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Sub-Category:</p>
                                    <p className="font-mono text-white bg-gray-800 p-2 rounded-md">Misc Expenses</p>
                                </div>
                                 <div>
                                    <p className="text-sm text-gray-400">Is Quote Input:</p>
                                    <p className="font-mono text-white bg-gray-800 p-2 rounded-md">Yes</p>
                                </div>
                             </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Purpose & Instructions</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Use this field to add a flat dollar amount for any additional materials you anticipate needing that are not covered by other specific inputs. This is useful for padding a quote for unknown complexities.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default LineItemProfilePage;