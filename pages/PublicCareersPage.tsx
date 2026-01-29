
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SparklesIcon, BoltIcon, RhiveLogo, ArrowRightIcon } from '../components/icons';
import { useNavigation } from '../contexts/NavigationContext';

const PublicCareersPage: React.FC = () => {
    const { setActivePageId } = useNavigation();

    return (
        <PageContainer 
            title="The Industry Revolution" 
            description="We're not just building roofs. We're architecting the future of service labor."
        >
            {/* Manifesto Hero */}
            <div className="relative p-12 rounded-[40px] bg-black border border-gray-800 overflow-hidden isolate mb-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ec028b]/20 via-black to-black z-0 opacity-60" />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
                        Join the <span className="text-[#ec028b]">Hive</span>
                    </h2>
                    <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
                        The roofing industry hasn't changed in 50 years. We're changing that today. RHIVE combines elite craftsmanship with Quantum OS automation to empower a new generation of skilled professionals.
                    </p>
                    <Button size="lg" className="px-12" onClick={() => {
                        const el = document.getElementById('jobs');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        View Openings
                        <ArrowRightIcon className="w-5 h-5 ml-3" />
                    </Button>
                </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { icon: BoltIcon, title: 'AI Driven', desc: 'We leverage proprietary AI to handle the mundane, so you can focus on high-impact results.' },
                    { icon: SparklesIcon, title: 'High Energy', desc: 'A culture of optimism, assertion, and ineffable quality in every interaction.' },
                    { icon: RhiveLogo, title: 'Community First', desc: 'Supporting veterans and teachers through dedicated regional roof donation programs.' }
                ].map((v, i) => (
                    <Card key={i} className="p-8 border-gray-800 hover:border-[#ec028b]/40 transition-colors">
                        <v.icon className="w-10 h-10 text-[#ec028b] mb-6" />
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{v.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                    </Card>
                ))}
            </div>

            {/* Job Board */}
            <div id="jobs" className="space-y-6">
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Active Opportunities</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Updated Live</span>
                </div>

                {[
                    { title: 'Project Design Specialist', dept: 'Sales', loc: 'Salt Lake City, UT', type: 'Commission' },
                    { title: 'Field Operations Lead', dept: 'Production', loc: 'North Logan, UT', type: 'Salary + Bonus' },
                    { title: 'AI Systems Architect', dept: 'Engineering', loc: 'Remote', type: 'Contract' },
                ].map((job, i) => (
                    <div 
                        key={i} 
                        className="group flex flex-col md:flex-row items-center justify-between p-6 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-[#ec028b] hover:bg-gray-900/60 transition-all cursor-pointer"
                        onClick={() => setActivePageId('P-11')}
                    >
                        <div className="mb-4 md:mb-0">
                            <h4 className="text-xl font-bold text-white group-hover:text-[#ec028b] transition-colors">{job.title}</h4>
                            <div className="flex gap-4 mt-1">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{job.dept}</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">•</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{job.loc}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="hidden lg:block text-xs font-mono text-gray-600">{job.type}</span>
                            <Button variant="secondary" size="sm">Apply Now</Button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="py-20 text-center">
                <p className="text-xs text-gray-600 uppercase font-black tracking-[0.5em] opacity-40">
                    Equality Opportunity • RHIVE Industries © 2025
                </p>
            </div>
        </PageContainer>
    );
};

export default PublicCareersPage;
