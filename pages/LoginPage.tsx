
import React from 'react';
import { 
    UserIcon, 
    BriefcaseIcon, 
    BuildingStorefrontIcon, 
    TruckIcon, 
    RhiveLogo,
    FingerPrintIcon,
    ZohoIcon,
    ArrowRightIcon
} from '../components/icons';
import { UserType } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

interface LoginPageProps {
    onLogin: (role: UserType) => void;
}

const PortalButton: React.FC<{
    role: UserType;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ role, icon, onClick }) => {
    const c = 20;

    return (
        <div 
            onClick={onClick}
            className={cn(
                "relative group cursor-pointer transition-all duration-500 h-36 flex flex-col items-center justify-center p-6 isolate hover:scale-[1.04]",
            )}
        >
            {/* Glassmorphic Background - No more black box */}
            <div 
                className={cn(
                    "absolute inset-0 transition-all duration-700 z-[-2] bg-white/5 backdrop-blur-md group-hover:bg-white/15 group-hover:backdrop-blur-xl border border-white/10 group-hover:border-rhive-pink/50",
                )}
                style={{ 
                    clipPath: `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`
                }}
            />

            {/* SVG Border Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <g stroke="#374151" strokeWidth="1.5" className="transition-all duration-500 group-hover:stroke-rhive-pink group-hover:drop-shadow-[0_0_8px_#ec028b]">
                    <line x1={`${c}px`} y1="0.5px" x2={`calc(100% - ${c}px)`} y2="0.5px" />
                    <line x1={`calc(100% - ${c}px)`} y1="0.5px" x2="calc(100% - 0.5px)" y2={`${c}px`} />
                    <line x1="calc(100% - 0.5px)" y1={`${c}px`} x2="calc(100% - 0.5px)" y2={`calc(100% - ${c}px)`} />
                    <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${c}px)`} x2={`calc(100% - ${c}px)`} y2="calc(100% - 0.5px)" />
                    <line x1={`calc(100% - ${c}px)`} y1="calc(100% - 0.5px)" x2={`${c}px`} y2="calc(100% - 0.5px)" />
                    <line x1={`${c}px`} y1="calc(100% - 0.5px)" x2="0.5px" y2={`calc(100% - ${c}px)`} />
                    <line x1="0.5px" y1={`calc(100% - ${c}px)`} x2="0.5px" y2={`${c}px`} />
                    <line x1="0.5px" y1={`${c}px`} x2={`${c}px`} y2="0.5px" />
                </g>
                <line 
                    x1="4px" y1={`${c-4}px`} x2={`${c-4}px`} y2="4px"
                    stroke="#ec028b" 
                    strokeWidth="2" 
                    className="opacity-40 group-hover:opacity-100 transition-opacity"
                />
            </svg>

            <div className={cn(
                "relative z-10 flex flex-col items-center gap-3 transition-all duration-300 text-rhive-pink group-hover:text-white"
            )}>
                <div className="w-10 h-10 drop-shadow-[0_0_10px_rgba(236,2,139,0.3)]">
                    {icon}
                </div>
                <span className="font-extrabold text-[10px] uppercase tracking-[0.3em] font-sans">{role}</span>
            </div>
        </div>
    );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const mainC = 40;

    const portals = [
        { role: 'Employee' as UserType, icon: <BriefcaseIcon className="w-full h-full" /> },
        { role: 'Customer' as UserType, icon: <UserIcon className="w-full h-full" /> },
        { role: 'Contractor' as UserType, icon: <BuildingStorefrontIcon className="w-full h-full" /> },
        { role: 'Supplier' as UserType, icon: <TruckIcon className="w-full h-full" /> },
    ];

    return (
        <div className="flex items-center justify-center h-full p-4 font-sans selection:bg-rhive-pink/40">
            <div className="w-full max-w-2xl flex flex-col items-center">
                <RhiveLogo className="h-20 w-auto mb-12 animate-fade-in" />
                
                <div className="w-full relative p-12 animate-fade-in isolate">
                    {/* Background Plate */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-md z-[-2]"
                        style={{ clipPath: `polygon(${mainC}px 0, calc(100% - ${mainC}px) 0, 100% ${mainC}px, 100% calc(100% - ${mainC}px), calc(100% - ${mainC}px) 100%, ${mainC}px 100%, 0 calc(100% - ${mainC}px), 0 ${mainC}px)` }}
                    />
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        <g stroke="#4b5563" strokeWidth="2" className="opacity-80">
                            <line x1={`${mainC}px`} y1="0.5px" x2={`calc(100% - ${mainC}px)`} y2="0.5px" />
                            <line x1={`calc(100% - ${mainC}px)`} y1="0.5px" x2="calc(100% - 0.5px)" y2={`${mainC}px`} />
                            <line x1="calc(100% - 0.5px)" y1={`${mainC}px`} x2="calc(100% - 0.5px)" y2={`calc(100% - ${mainC}px)`} />
                            <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${mainC}px)`} x2={`calc(100% - ${mainC}px)`} y2="calc(100% - 0.5px)" />
                            <line x1={`calc(100% - ${mainC}px)`} y1="calc(100% - 0.5px)" x2={`${mainC}px`} y2="calc(100% - 0.5px)" />
                            <line x1={`${mainC}px`} y1="calc(100% - 0.5px)" x2="0.5px" y2={`calc(100% - ${mainC}px)`} />
                            <line x1="0.5px" y1={`calc(100% - ${mainC}px)`} x2="0.5px" y2={`${mainC}px`} />
                            <line x1="0.5px" y1={`${mainC}px`} x2={`${mainC}px`} y2="0.5px" />
                        </g>
                        <line x1="0" y1={mainC} x2={mainC} y2="0" stroke="#ec028b" strokeWidth="3" className="drop-shadow-[0_0_8px_#ec028b]" />
                        <line x1="calc(100% - 0.5px)" y1={`calc(100% - ${mainC}px)`} x2={`calc(100% - ${mainC}px)`} y2="calc(100% - 0.5px)" stroke="#ec028b" strokeWidth="3" className="drop-shadow-[0_0_8px_#ec028b]" />
                    </svg>

                    <div className="text-center mb-10 relative z-20">
                        <h2 className="text-4xl font-black text-white tracking-[0.25em] uppercase mb-2">QOS Gateway</h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-700" />
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Quantum Operating System v2.5</p>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-700" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12 relative z-20">
                        {portals.map((p) => (
                            <PortalButton 
                                key={p.role} 
                                role={p.role} 
                                icon={p.icon} 
                                onClick={() => onLogin(p.role)}
                            />
                        ))}
                    </div>

                    <div className="space-y-6 relative z-20 max-w-md mx-auto">
                        {/* New Separate PUBLIC PAGES Button */}
                        <Button 
                            onClick={() => onLogin('Public')}
                            className="w-full h-16 text-sm font-black tracking-[0.3em] transition-all duration-500 uppercase border-rhive-pink/50 bg-black/40 text-rhive-pink hover:bg-rhive-pink hover:text-white shadow-[0_0_40px_rgba(236,2,139,0.2)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] hover:scale-[1.02]"
                        >
                            <span>PUBLIC PAGES</span>
                            <ArrowRightIcon className="w-5 h-5 ml-3" />
                        </Button>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800/50">
                            <button className="flex items-center justify-center gap-3 p-4 bg-gray-900/40 border border-gray-800 text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] hover:border-rhive-pink/50 hover:text-white transition-all rounded-lg group">
                                <ZohoIcon className="w-4 h-4 group-hover:text-rhive-pink transition-colors" />
                                Zoho Auth
                            </button>
                            <button className="flex items-center justify-center gap-3 p-4 bg-gray-900/40 border border-gray-800 text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] hover:border-rhive-pink/50 hover:text-white transition-all rounded-lg group">
                                <FingerPrintIcon className="w-4 h-4 group-hover:text-rhive-pink transition-colors" />
                                Biometrics
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 text-center relative z-20">
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.5em] opacity-50">
                            Restricted Access • RHIVE Industries © 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
