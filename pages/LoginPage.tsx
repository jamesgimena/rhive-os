
import React, { useState } from 'react';
import { 
    UserIcon, 
    BriefcaseIcon, 
    BuildingStorefrontIcon, 
    TruckIcon, 
    RhiveLogo,
    FingerPrintIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
    LockIcon,
    KeyIcon,
    XIcon
} from '../components/icons';
import { UserType } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

interface LoginPageProps {
    onLogin: (role: UserType, password?: string) => Promise<any>;
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
            <div 
                className={cn(
                    "absolute inset-0 transition-all duration-700 z-[-2] bg-white/5 backdrop-blur-md group-hover:bg-white/15 group-hover:backdrop-blur-xl border border-white/10 group-hover:border-rhive-pink/50",
                )}
                style={{ 
                    clipPath: `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`
                }}
            />

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
    const [isInternalMode, setIsInternalMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const publicPortals = [
        { role: 'Customer' as UserType, icon: <UserIcon className="w-full h-full" /> },
        { role: 'Contractor' as UserType, icon: <BuildingStorefrontIcon className="w-full h-full" /> },
        { role: 'Supplier' as UserType, icon: <TruckIcon className="w-full h-full" /> },
    ];

    const internalPortals = [
        { role: 'Employee' as UserType, icon: <BriefcaseIcon className="w-4 h-4" />, label: 'Employee Portal' },
        { role: 'Admin' as UserType, icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Admin Terminal' },
        { role: 'Super Admin' as UserType, icon: <FingerPrintIcon className="w-4 h-4" />, label: 'Super Override' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;
        const result = await onLogin(selectedRole, password);
        if (result && !result.success) {
            setError(result.error || 'Verification failed.');
            setTimeout(() => setError(''), 3000);
        }
    };

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
                        <h2 className="text-4xl font-black text-white tracking-[0.25em] uppercase mb-2">
                            {isInternalMode ? 'Internal Access' : 'QOS Gateway'}
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-700" />
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                                {isInternalMode ? 'Secure Verification Protocol' : 'Quantum Operating System v2.5'}
                            </p>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-700" />
                        </div>
                    </div>

                    {!isInternalMode ? (
                        <div className="space-y-8 relative z-20">
                            <div className="grid grid-cols-3 gap-6">
                                {publicPortals.map((p) => (
                                    <PortalButton 
                                        key={p.role} 
                                        role={p.role} 
                                        icon={p.icon} 
                                        onClick={() => onLogin(p.role)}
                                    />
                                ))}
                            </div>

                            <div className="space-y-6 max-w-md mx-auto">
                                <Button 
                                    onClick={() => onLogin('Public')}
                                    className="w-full h-16 text-sm font-black tracking-[0.3em] transition-all duration-500 uppercase border-rhive-pink/50 bg-black/40 text-rhive-pink hover:bg-rhive-pink hover:text-white shadow-[0_0_40px_rgba(236,2,139,0.2)] hover:shadow-[0_0_40px_rgba(236,2,139,0.5)] hover:scale-[1.02]"
                                >
                                    <span>PUBLIC PAGES</span>
                                    <ArrowRightIcon className="w-5 h-5 ml-3" />
                                </Button>

                                <button 
                                    onClick={() => setIsInternalMode(true)}
                                    className="w-full py-4 px-6 bg-gray-900/40 border border-gray-800 text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] hover:border-[#ec028b]/50 hover:text-white transition-all rounded-full flex items-center justify-center gap-3 group"
                                >
                                    <LockIcon className="w-4 h-4 group-hover:text-[#ec028b] transition-colors" />
                                    Internal Gateway Access
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-20 animate-slide-up max-w-md mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-3">
                                    {internalPortals.map((p) => (
                                        <button
                                            key={p.role}
                                            type="button"
                                            onClick={() => setSelectedRole(p.role)}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-xl border transition-all uppercase tracking-widest text-[10px] font-black",
                                                selectedRole === p.role 
                                                    ? "bg-[#ec028b]/20 border-[#ec028b] text-white shadow-[0_0_20px_rgba(236,2,139,0.2)]" 
                                                    : "bg-black/20 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                                            )}
                                        >
                                            <div className={cn("p-2 rounded-lg", selectedRole === p.role ? "bg-[#ec028b] text-white" : "bg-gray-900 text-gray-500")}>
                                                {p.icon}
                                            </div>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ec028b] transition-colors">
                                        <KeyIcon className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="password"
                                        placeholder="STATION SECURITY KEY"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/60 border border-gray-800 focus:border-[#ec028b] outline-none text-white px-12 py-4 rounded-xl text-xs font-mono tracking-widest transition-all placeholder:text-gray-700"
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <p className="text-[#ec028b] text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                                        {error}
                                    </p>
                                )}

                                <div className="flex gap-4">
                                    <Button 
                                        type="button"
                                        onClick={() => { setIsInternalMode(false); setSelectedRole(null); setPassword(''); }}
                                        className="flex-1 h-14 bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800 hover:text-white rounded-xl uppercase tracking-widest text-[10px] font-black"
                                    >
                                        <XIcon className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        disabled={!selectedRole || !password}
                                        className="flex-[2] h-14 bg-[#ec028b] hover:bg-[#ff039a] text-white rounded-xl uppercase tracking-widest text-[10px] font-black shadow-[0_0_30px_rgba(236,2,139,0.3)]"
                                    >
                                        Establish Link
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

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
