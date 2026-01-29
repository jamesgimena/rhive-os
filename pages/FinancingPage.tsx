
import React from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CurrencyDollarIcon, BoltIcon, ShieldCheckIcon, ArrowRightIcon } from '../components/icons';

const FinancingPage: React.FC = () => {
    return (
        <PageContainer 
            title="Savings & Financing" 
            description="RHIVE Project Savings Promotion (RPSP) and customer-centric payment options."
        >
            {/* RPSP Promo Header */}
            <div className="relative p-8 md:p-12 rounded-3xl bg-gray-900 border border-[#ec028b]/50 shadow-pink-glow overflow-hidden mb-12 isolate">
                <div className="absolute top-0 right-0 p-32 bg-[#ec028b] rounded-full blur-[120px] opacity-10 -mr-16 -mt-16" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <BoltIcon className="w-5 h-5 text-pink-500" />
                            <span className="text-[#ec028b] text-xs font-black uppercase tracking-[0.4em]">Exclusive Initiative</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">RHIVE Project Savings Promotion</h2>
                        <p className="text-gray-300 leading-relaxed mb-6 font-serif text-lg">
                            We've analyzed customer costs and acquisition timelines. By eliminating unnecessary follow-up calls 
                            and decision lag, we pass those operational savings directly to you.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-black/50 border border-pink-500/30 px-6 py-4 rounded-2xl">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Residential Savings</p>
                                <p className="text-2xl font-black text-white">UP TO $1,000</p>
                            </div>
                            <div className="bg-black/50 border border-pink-500/30 px-6 py-4 rounded-2xl">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Commercial Savings</p>
                                <p className="text-2xl font-black text-white">UP TO $3,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/60 border border-gray-800 p-8 rounded-3xl text-center backdrop-blur-xl w-full md:w-80">
                        <h3 className="text-white font-bold uppercase mb-2">Promotion Logic</h3>
                        <p className="text-rhive-pink font-black text-4xl mb-4">48 HRS</p>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                            Commit within 48 hours of your Certified Quote to activate the RPSP discount.
                        </p>
                        <div className="p-3 bg-[#ec028b]/10 rounded-lg border border-[#ec028b]/30 flex items-center gap-3 text-left">
                            <ShieldCheckIcon className="w-5 h-5 text-[#ec028b]" />
                            <p className="text-[10px] text-white font-medium uppercase tracking-tight">3-Day Right to Rescind (UTAH)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Schedule */}
            <div className="mb-12">
                <h3 className="text-2xl font-black text-white uppercase tracking-widest text-center mb-10">Investment Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: "50%", label: "Agreement Signing", desc: "Initial investment required to approve permits and trigger material procurement." },
                        { step: "40%", label: "Installation Day", desc: "Second investment due upon substantial completion of the main roofing structure." },
                        { step: "10%", label: "Final Satisfaction", desc: "Final balance due only upon 100% project completion and total client approval." }
                    ].map((s, i) => (
                        <Card key={i} className="p-8 text-center border-gray-800 hover:border-[#ec028b]/40 transition-colors group">
                            <div className="text-4xl font-black text-[#ec028b] mb-4 group-hover:scale-110 transition-transform">{s.step}</div>
                            <h4 className="text-white font-bold uppercase tracking-tight mb-2">{s.label}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Financing CTA */}
            <Card className="p-10 bg-gradient-to-br from-gray-900 to-black flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <CurrencyDollarIcon className="w-10 h-10 text-green-400" />
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Hassle-Free Financing</h3>
                    </div>
                    <p className="text-gray-400 max-w-xl">
                        Starting as low as 4.99% APR with options for $0 Down. Get pre-qualified instantly 
                        without impacting your credit score.
                    </p>
                </div>
                <button className="whitespace-nowrap px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex items-center">
                    Prequalify Now
                    <ArrowRightIcon className="w-5 h-5 ml-3" />
                </button>
            </Card>
        </PageContainer>
    );
};

export default FinancingPage;
