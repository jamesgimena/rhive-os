
import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CameraIcon, CloudArrowUpIcon, UserIcon, ArrowRightIcon, Check } from '../components/icons';
import { cn } from '../lib/utils';

const JobApplicationPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: '' });

    const totalSteps = 4;
    const next = () => step < totalSteps && setStep(s => s + 1);
    const prev = () => step > 1 && setStep(s => s - 1);

    return (
        <PageContainer 
            title="Candidate Intake Wizard" 
            description="Submit your credentials to the RHIVE Talent Core."
        >
            <div className="max-w-xl mx-auto py-8">
                {/* Step Indicator */}
                <div className="mb-12 text-center">
                    <p className="text-[10px] text-rhive-pink font-black uppercase tracking-[0.3em] mb-2">Step {step} of {totalSteps}</p>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={cn("h-1 w-8 rounded-full", step >= s ? "bg-[#ec028b]" : "bg-gray-800")} />
                        ))}
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-8">
                            <h3 className="text-3xl font-black text-white uppercase text-center leading-tight">Tell us your name and where we can reach you.</h3>
                            <div className="space-y-4">
                                <Input 
                                    placeholder="Full Name" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                                <Input 
                                    placeholder="Email Address" 
                                    type="email"
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                />
                                <Input 
                                    placeholder="Mobile Phone" 
                                    type="tel"
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in space-y-8">
                            <h3 className="text-3xl font-black text-white uppercase text-center leading-tight">Your Resume & Credentials</h3>
                            <div className="border-2 border-dashed border-gray-700 rounded-3xl p-12 text-center bg-gray-900/20 hover:border-[#ec028b]/50 transition-colors cursor-pointer group">
                                <CloudArrowUpIcon className="w-12 h-12 text-gray-600 mx-auto mb-4 group-hover:text-[#ec028b] transition-colors" />
                                <p className="text-white font-bold mb-1">Drag & Drop Resume</p>
                                <p className="text-xs text-gray-500">PDF, DOCX, or RTF (10MB Max)</p>
                            </div>
                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <UserIcon className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-xs text-blue-300 leading-relaxed">
                                    <strong>Pro Tip:</strong> We value structured data. Our AI parsing will extract your key milestones for our hiring leads.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in space-y-8">
                            <h3 className="text-3xl font-black text-white uppercase text-center leading-tight">The Video Cover Letter (Optional)</h3>
                            <p className="text-gray-400 text-sm text-center italic">
                                "High energy is a core value. Show us your spirit in a 30-second introduction."
                            </p>
                            <div className="relative group rounded-[32px] border border-gray-800 bg-gray-900/50 aspect-video flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#ec028b]/50 transition-all">
                                <CameraIcon className="w-12 h-12 text-[#ec028b] mb-4 group-hover:scale-110 transition-transform" />
                                <span className="text-white font-black uppercase tracking-widest text-sm">Launch Recorder</span>
                                <div className="absolute inset-0 bg-[#ec028b]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-fade-in space-y-8 text-center py-8">
                            <div className="w-24 h-24 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/50 flex items-center justify-center mx-auto mb-8 shadow-pink-glow">
                                <Check className="w-12 h-12 text-[#ec028b]" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase">Application Ready</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                                By submitting, you confirm that you are ready to revolutionize an industry and work with the best team in roofing.
                            </p>
                            <Button className="w-full h-16 text-lg" onClick={() => alert("Application Submitted Successfully!")}>
                                Send Application
                            </Button>
                        </div>
                    )}
                </div>

                {step < 4 && (
                    <div className="mt-16 flex gap-4">
                        {step > 1 && (
                            <Button variant="secondary" className="flex-1 h-14" onClick={prev}>Back</Button>
                        )}
                        <Button className="flex-[2] h-14" onClick={next}>
                            Continue
                            <ArrowRightIcon className="w-4 h-4 ml-3" />
                        </Button>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default JobApplicationPage;
