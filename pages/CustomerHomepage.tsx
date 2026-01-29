import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { BriefcaseIcon, UserIcon, Cog6ToothIcon, PaintBrushIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const ActionCard = ({ title, Icon }: { title: string, Icon: React.FC<any> }) => (
    <Card className="text-center hover:scale-105 transform transition-transform duration-300">
        <Icon className="w-12 h-12 mx-auto text-[#ec028b] mb-3" />
        <h3 className="font-bold text-white">{title}</h3>
    </Card>
);

const CustomerHomepage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'C-01');

    return (
        <PageContainer title="Welcome to Your RHIVE Portal" description={page?.description || 'Manage your projects and communicate with us.'}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ActionCard title="View My Projects" Icon={BriefcaseIcon} />
                <ActionCard title="Make a Payment" Icon={PaintBrushIcon} />
                <ActionCard title="My Profile" Icon={UserIcon} />
                <ActionCard title="Support" Icon={Cog6ToothIcon} />
            </div>
             <div className="mt-6">
                <Card title="Recent Activity">
                    <p className="text-gray-400">No new activity.</p>
                </Card>
            </div>
        </PageContainer>
    );
};

export default CustomerHomepage;