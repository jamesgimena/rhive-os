
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { PAGE_GROUPS } from '../constants';
import { DocumentCheckIcon, UserIcon, TruckIcon, PlusIcon, ChevronRightIcon } from '../components/icons';
import { cn } from '../lib/utils';

const LogicGate = ({ title, isMet, icon: Icon, actionLabel }: { title: string, isMet: boolean, icon: any, actionLabel: string }) => (
    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${isMet ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-900/50 border-gray-700'}`}>
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isMet ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h4 className={`font-bold ${isMet ? 'text-green-400' : 'text-white'}`}>{title}</h4>
                <p className="text-xs text-gray-400">{isMet ? 'Requirement Met' : 'Required to Advance'}</p>
            </div>
        </div>
        {!isMet ? (
             <Button size="sm" variant="secondary" className="flex items-center gap-2">
                 <PlusIcon className="w-4 h-4" />
                 {actionLabel}
             </Button>
        ) : (
            <DocumentCheckIcon className="w-6 h-6 text-green-500" />
        )}
    </div>
);

const SchedulePage: React.FC = () => {
    // Simulation State
    const [stageRequirements, setStageRequirements] = useState({
        permit: true,
        materials: false,
        labor: true,
        weather: true
    });

    const canAdvance = Object.values(stageRequirements).every(Boolean);

    return (
        <PageContainer title="Project Scheduling (Stage 4)" description="Enforce logic gates before moving to Pre-Installation.">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Stage 4 Logic Gates: Requirements to Advance">
                        <div className="space-y-4">
                            <LogicGate 
                                title="Permit Status: Approved" 
                                isMet={stageRequirements.permit} 
                                icon={DocumentCheckIcon} 
                                actionLabel="Upload Permit" 
                            />
                            <LogicGate 
                                title="Material Order: Confirmed" 
                                isMet={stageRequirements.materials} 
                                icon={TruckIcon} 
                                actionLabel="Create PO" 
                            />
                            <LogicGate 
                                title="Labor Assignment: Crew Accepted" 
                                isMet={stageRequirements.labor} 
                                icon={UserIcon} 
                                actionLabel="Assign Crew" 
                            />
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                            <div className="text-sm text-gray-400">
                                Logic Check: {canAdvance ? <span className="text-green-400 font-bold">PASS</span> : <span className="text-red-400 font-bold">BLOCKED</span>}
                            </div>
                            <Button disabled={!canAdvance} className={cn("flex items-center gap-2", !canAdvance ? 'opacity-50 cursor-not-allowed' : '')}>
                                <span>Advance to Pre-Installation (Stage 5)</span>
                                <ChevronRightIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </Card>

                    <Card title="Installation Calendar">
                        <div className="h-64 bg-gray-900/50 rounded-lg p-4 flex items-center justify-center border border-gray-800">
                            <p className="text-gray-500">Calendar View (Syncs with Google/Outlook)</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card title="Project Context">
                        <h3 className="font-bold text-white mb-1">Hill AFB Hangar 42</h3>
                        <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">Government</span>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Install Date</span>
                                <span className="text-white">Oct 12, 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Duration</span>
                                <span className="text-white">14 Days</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Compliance Checks">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center text-green-400">
                                <DocumentCheckIcon className="w-4 h-4 mr-2" /> Wage Determination
                            </li>
                            <li className="flex items-center text-green-400">
                                <DocumentCheckIcon className="w-4 h-4 mr-2" /> Bonding Proof
                            </li>
                            <li className="flex items-center text-gray-500">
                                <span className="w-4 h-4 mr-2 border border-gray-600 rounded-full"></span> Certified Payroll (Pending Install)
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default SchedulePage;
