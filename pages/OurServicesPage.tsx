
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BuildingStorefrontIcon, UserIcon, GutterIcon, SnowflakeIcon, ArrowRightIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';

const ServiceCard = ({ title, icon: Icon, details, cta, onClick }: any) => (
    <Card className="flex flex-col h-full group overflow-hidden">
        <div className="p-8 flex-1">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800 group-hover:border-[#ec028b]/50 transition-all">
                <Icon className="w-8 h-8 text-[#ec028b]" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{title}</h3>
            <ul className="space-y-3">
                {details.map((d: string, i: number) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start">
                        <span className="text-[#ec028b] mr-2">•</span>
                        {d}
                    </li>
                ))}
            </ul>
        </div>
        <div className="p-6 bg-black/40 border-t border-gray-800">
            <Button onClick={onClick} className="w-full">
                {cta}
                <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
        </div>
    </Card>
);

const OurServicesPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    const services = [
        {
            title: "Residential Roofing",
            icon: UserIcon,
            details: [
                "Owens Corning Duration® Series",
                "California Cut Valley installation",
                "Strict No-Layover policy",
                "SureNail® technology implementation",
                "Lifetime No-Leak Guarantee"
            ],
            cta: "Get Shingle Quote",
            onClick: () => setActivePageId('P-12')
        },
        {
            title: "Commercial Solutions",
            icon: BuildingStorefrontIcon,
            details: [
                "GAF PVC & TPO Membrane Systems",
                "NDL (No Dollar Limit) Warranty",
                "Energy-efficient insulation boards",
                "Heat-welded seam integrity",
                "Complex drainage engineering"
            ],
            cta: "Schedule Site Assessment",
            onClick: () => setActivePageId('P-12')
        },
        {
            title: "Gutter Systems",
            icon: GutterIcon,
            details: [
                "5\" and 6\" Seamless Aluminum",
                "K-Style, Half-Round & Box Square",
                "Premium Leaf Guard integration",
                "Custom mitered corners",
                "High-capacity downspout options"
            ],
            cta: "Add Gutter Estimate",
            onClick: () => setActivePageId('P-12')
        },
        {
            title: "Ice Management",
            icon: SnowflakeIcon,
            details: [
                "Commercial-grade Heat Cables",
                "Automated sensor integration",
                "Prevents ice-dam backup",
                "Eave and Valley protection",
                "Snow retention systems"
            ],
            cta: "Protect My Roof",
            onClick: () => setActivePageId('P-12')
        }
    ];

    return (
        <PageContainer 
            title="Our Capabilities" 
            description="Specialized roofing solutions engineered for longevity and extreme weather performance."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((s, i) => (
                    <ServiceCard key={i} {...s} />
                ))}
            </div>

            <div className="mt-12 p-8 bg-pink-900/10 border border-pink-500/20 rounded-3xl text-center">
                <h4 className="text-xl font-bold text-white uppercase mb-4">The RHIVE Quality Standard</h4>
                <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                    Unlike "budget" contractors who mix-and-match materials, RHIVE utilizes only manufacturer-certified 
                    integrated systems to safeguard your full warranty protection.
                </p>
                <div className="flex justify-center gap-4">
                    <div className="px-4 py-2 bg-black border border-gray-800 rounded-full text-xs font-bold text-[#ec028b]">NO LAYOVERS</div>
                    <div className="px-4 py-2 bg-black border border-gray-800 rounded-full text-xs font-bold text-[#ec028b]">CALIFORNIA CUT</div>
                    <div className="px-4 py-2 bg-black border border-gray-800 rounded-full text-xs font-bold text-[#ec028b]">NDL WARRANTIES</div>
                </div>
            </div>
        </PageContainer>
    );
};

export default OurServicesPage;
