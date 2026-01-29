import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarDaysIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const EmployeeTimeoffPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-04');
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <PageContainer title={page?.name || 'Employee Time Off'} description={page?.description || 'Manage your time off and view schedules.'}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Team Calendar - July 2024">
                        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
                            {days.map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Placeholder for calendar days */}
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className={`h-16 rounded-lg bg-gray-900/50 border border-gray-700/50 flex items-center justify-center text-sm ${i < 2 || i > 32 ? 'text-gray-600' : 'text-white'}`}>
                                    {i > 1 && i < 33 ? i - 1 : ''}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card title="Your Balances">
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                                <span className="text-gray-300">Paid Time Off (PTO)</span>
                                <span className="font-bold text-white">80 hours</span>
                            </div>
                             <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                                <span className="text-gray-300">Holidays</span>
                                <span className="font-bold text-white">5 days</span>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <Button size="lg" className="w-full">
                            <CalendarDaysIcon className="w-5 h-5 mr-2" />
                            Request Time Off
                        </Button>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default EmployeeTimeoffPage;