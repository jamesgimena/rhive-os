
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { KeyIcon, ArrowRightIcon } from '../components/icons';
import { cn } from '../lib/utils';

const PasswordResetPage: React.FC = () => {
    const [method, setMethod] = useState<'Phone' | 'Email'>('Phone');
    const [inputValue, setInputValue] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // Specifications mandate "Ghost" logic: always show success to prevent enumeration
        setIsSent(true);
    };

    return (
        <div className="h-full flex items-center justify-center p-6 bg-black isolate">
            <div className="w-full max-w-md animate-fade-in">
                <Card className="p-8 relative overflow-hidden">
                    {/* Pink accent bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#ec028b] shadow-[0_0_10px_#ec028b]" />
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 shadow-pink-glow-sm">
                            <KeyIcon className="w-8 h-8 text-[#ec028b]" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Account Recovery</h2>
                        <p className="text-gray-500 text-xs mt-2 uppercase font-bold tracking-widest">Secure QOS Access Protocol</p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="flex bg-gray-900/60 p-1 rounded-xl border border-gray-800">
                                {(['Phone', 'Email'] as const).map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMethod(m)}
                                        className={cn(
                                            "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                            method === m ? "bg-gray-800 text-[#ec028b] border border-[#ec028b]/30 shadow-pink-glow-sm" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                    Your Registered {method}
                                </label>
                                <Input 
                                    placeholder={method === 'Phone' ? "(555) 000-0000" : "name@rhive.com"}
                                    type={method === 'Phone' ? "tel" : "email"}
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="p-4 bg-black/40 border border-gray-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-sm border border-gray-700 bg-gray-900 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-700 rounded-full" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">reCAPTCHA v3 Protected</span>
                                </div>
                            </div>

                            <Button className="w-full h-14 text-xs font-black tracking-[0.2em]">
                                Send Recovery Code
                                <ArrowRightIcon className="w-4 h-4 ml-3" />
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-6 animate-fade-in">
                            <p className="text-white font-bold mb-4">Request Initialized</p>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                If an account exists with that information, we have sent a secure 6-digit recovery code. Please check your {method.toLowerCase()}.
                            </p>
                            <Button variant="secondary" onClick={() => setIsSent(false)} className="w-full">
                                Try Again
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PasswordResetPage;
