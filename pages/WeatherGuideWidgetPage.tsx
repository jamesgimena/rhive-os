import React from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { SunIcon, CloudIcon, BoltIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

const WeatherDay = ({ day, Icon, temp }: { day: string, Icon: React.FC<any>, temp: string }) => (
    <div className="text-center p-2 bg-gray-900/50 rounded-lg">
        <p className="font-semibold text-sm">{day}</p>
        <Icon className="w-10 h-10 mx-auto my-2 text-yellow-400" />
        <p className="font-mono">{temp}</p>
    </div>
);

const WeatherGuideWidgetPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-30');

    return (
        <PageContainer title={page?.name || 'Weather Guide Widget'} description={page?.description || 'A reusable component for weather forecasts.'}>
            <Card title="Component Preview: Weather Guide">
                <p className="text-gray-400 mb-4">This component can be embedded on pages like the "Schedule" page to help with planning.</p>
                <div className="p-4 border border-dashed border-gray-600 rounded-lg">
                    <div className="grid grid-cols-5 gap-4">
                        <WeatherDay day="Mon" Icon={SunIcon} temp="75°F" />
                        <WeatherDay day="Tue" Icon={CloudIcon} temp="72°F" />
                        <WeatherDay day="Wed" Icon={BoltIcon} temp="68°F" />
                        <WeatherDay day="Thu" Icon={SunIcon} temp="78°F" />
                        <WeatherDay day="Fri" Icon={SunIcon} temp="80°F" />
                    </div>
                </div>
            </Card>
        </PageContainer>
    );
};

export default WeatherGuideWidgetPage;