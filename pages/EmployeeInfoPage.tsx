
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useMockDB } from '../contexts/MockDatabaseContext';
import { 
    UserIcon, 
    MapPinIcon, 
    BriefcaseIcon, 
    CalendarDaysIcon
} from '../components/icons';

const EmployeeInfoPage: React.FC = () => {
    const { currentUser } = useMockDB();
    const [activeTab, setActiveTab] = useState('overview');

    if (!currentUser || currentUser.role !== 'Employee') return <div>Access Denied</div>;

    return (
        <PageContainer title="Employee Profile" description="Manage your personal information.">
            <Card className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#ec028b] rounded-full filter blur-3xl opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start p-2">
                    <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-[#ec028b]/50 flex items-center justify-center mb-4 md:mb-0 md:mr-6 shadow-lg overflow-hidden">
                        {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="Profile" /> : <UserIcon className="w-12 h-12 text-gray-400" />}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
                        <p className="text-[#ec028b] font-medium">Senior Project Manager</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-400">
                            <span className="flex items-center"><BriefcaseIcon className="w-4 h-4 mr-1" /> ID: {currentUser.id}</span>
                            <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1" /> Salt Lake City, UT</span>
                        </div>
                    </div>
                </div>
            </Card>
            {/* Remaining static content for UI demo purposes */}
            <Card title="Assigned Tasks">
                <p className="text-gray-400">Review pending quotes for approval.</p>
            </Card>
        </PageContainer>
    );
};

export default EmployeeInfoPage;
