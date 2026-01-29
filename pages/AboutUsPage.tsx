
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card, CardContent } from '../components/ui/card';
import { ShieldCheckIcon, UserIcon, SparklesIcon, ArrowRightIcon } from '../components/icons';

const AboutUsPage: React.FC = () => {
    return (
        <PageContainer 
            title="About RHIVE Construction" 
            description="Revolutionizing the roofing industry with AI and transparency."
        >
            {/* Hero Section */}
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden flex items-center justify-center bg-gray-900 border border-gray-800 shadow-2xl mb-12 isolate">
                <div className="absolute inset-0 bg-gradient-to-br from-rhive-pink/20 to-black z-0" />
                <div className="relative z-10 text-center px-6">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 animate-fade-in">
                        Finish On Top
                    </h2>
                    <p className="text-rhive-pink text-lg md:text-2xl font-bold uppercase tracking-[0.3em] animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        The Future of Roofing is Here
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="p-8">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-3 text-rhive-pink" />
                        Our Vision
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-serif text-lg">
                        Revolutionize the roofing industry by fusing advanced AI‑driven automation with timeless craftsmanship—delivering unparalleled efficiency, transparent pricing, and lasting quality while positively impacting our communities.
                    </p>
                </Card>
                <Card className="p-8">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 flex items-center">
                        <ShieldCheckIcon className="w-6 h-6 mr-3 text-rhive-pink" />
                        Our Mission
                    </h3>
                    <p className="text-gray-300 leading-relaxed font-serif text-lg">
                        Empower homeowners with a fully transparent quoting process that reveals every cost component—ensuring you have the knowledge and confidence to make an informed decision about your roofing project.
                    </p>
                </Card>
            </div>

            {/* Core Values */}
            <div className="mb-12">
                <h3 className="text-3xl font-black text-white uppercase tracking-widest text-center mb-10">Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Transparency', desc: 'Complete openness, providing clear and detailed cost breakdowns to build trust.' },
                        { title: 'Integrity', desc: 'Decisions guided by honesty, fairness, and doing what is right for everyone.' },
                        { title: 'Value', desc: 'Highest standards of quality using only top-tier, manufacturer-certified materials.' }
                    ].map((v) => (
                        <Card key={v.title} className="p-6 text-center group">
                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-rhive-pink transition-colors uppercase tracking-widest">{v.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Founders Section */}
            <div className="mb-12">
                <SectionHeader title="Leadership" icon={UserIcon} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FounderCard 
                        name="Kara Robinson" 
                        title="Founder / President" 
                        bio="A visionary leader dedicated to operational excellence and community impact. Kara drives the strategic growth and cultural integrity of RHIVE."
                        phone="801‑441‑0024"
                    />
                    <FounderCard 
                        name="Michael Robinson" 
                        title="Founder / CEO" 
                        bio="The architect of RHIVE's technological revolution. Michael merges deep industry expertise with cutting-edge AI systems."
                        phone="801‑449‑1451"
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-12 border-t border-gray-800 text-center">
                <button className="inline-flex items-center gap-3 px-10 py-5 bg-rhive-pink text-white font-black uppercase tracking-[0.2em] rounded-full shadow-pink-glow hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] transition-all">
                    Contact Leadership
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        </PageContainer>
    );
};

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
        <Icon className="w-8 h-8 text-rhive-pink" />
        <h3 className="text-3xl font-black text-white uppercase tracking-tight">{title}</h3>
    </div>
);

const FounderCard = ({ name, title, bio, phone }: any) => (
    <Card className="flex flex-col md:flex-row gap-6 p-6">
        <div className="w-32 h-32 rounded-2xl bg-gray-800 flex-shrink-0 border border-gray-700 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-gray-600" />
        </div>
        <div>
            <h4 className="text-xl font-bold text-white uppercase tracking-tight">{name}</h4>
            <p className="text-rhive-pink text-xs font-bold uppercase tracking-widest mb-3">{title}</p>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{bio}</p>
            <p className="text-white font-mono text-sm">{phone}</p>
        </div>
    </Card>
);

export default AboutUsPage;
