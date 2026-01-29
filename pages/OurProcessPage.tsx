
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Check, BoltIcon } from '../components/icons';
import { cn } from '../lib/utils';

const StageNode = ({ number, title, description, isLast }: any) => (
    <div className="flex gap-6 md:gap-10 items-start">
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black border-2 border-[#ec028b] flex items-center justify-center text-[#ec028b] font-black shadow-[0_0_15px_rgba(236,2,139,0.3)] z-10 shrink-0">
                {number}
            </div>
            {!isLast && <div className="w-0.5 h-24 md:h-20 bg-gradient-to-b from-[#ec028b] to-transparent -mt-2 opacity-50" />}
        </div>
        <div className="pt-1 pb-10">
            <h4 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight mb-2 flex items-center">
                {title}
                <BoltIcon className="w-4 h-4 ml-2 text-pink-500/50" />
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{description}</p>
        </div>
    </div>
);

const OurProcessPage: React.FC = () => {
    const stages = [
        { title: "Lead Intake", desc: "Our AI core analyzes your property via satellite and enriches data for an instant preliminary assessment." },
        { title: "Instant Estimate", desc: "Receive a ballpark investment range immediately, based on real-time material costs and regional labor rates." },
        { title: "Certified Quote", desc: "A precision Roofr aerial report and discovery consultation finalize the firm, signable project investment." },
        { title: "Sign & Invest", desc: "Secure your place in the queue with digital signatures and a 50% initial investment to trigger material procurement." },
        { title: "Scheduling", desc: "Automated logic gates handle permitting and coordinate the delivery of materials and dedicated field crews." },
        { title: "Pre-Installation", desc: "Receive automated weekly status updates and a comprehensive preparation guide 3 days before work begins." },
        { title: "Installation", desc: "Full tear-off to decking. Our field teams upload progress photos to your portal in real-time." },
        { title: "Punch List", desc: "Final quality checks and debris removal. Every facet is verified against manufacturer standards." },
        { title: "Invoicing", desc: "Final payment is requested only upon 100% project satisfaction and verification of work standard." },
        { title: "Project Complete", desc: "Receive your full documentation packet, including registered warranties and our Lifetime No-Leak Guarantee." }
    ];

    return (
        <PageContainer 
            title="The 10-Stage Journey" 
            description="Experience a construction project defined by transparency, automation, and consistent communication."
        >
            <Card className="p-8 md:p-12">
                <div className="mb-10 p-6 bg-[#ec028b]/5 border border-[#ec028b]/20 rounded-2xl flex items-center gap-4">
                    <Check className="w-8 h-8 text-green-400 shrink-0" />
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Automated Transparency</h3>
                        <p className="text-gray-400 text-xs mt-1">Our system prevents "ghosting" by sending automated status alerts at every transition stage.</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    {stages.map((s, i) => (
                        <StageNode key={i} number={i + 1} title={s.title} description={s.desc} isLast={i === stages.length - 1} />
                    ))}
                </div>
            </Card>

            <div className="mt-8 text-center pb-12">
                <p className="text-gray-500 text-sm font-mono uppercase tracking-[0.3em]">Quantum Operating System v2.5 Process Engine</p>
            </div>
        </PageContainer>
    );
};

export default OurProcessPage;
