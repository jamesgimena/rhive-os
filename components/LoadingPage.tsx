import React, { useState, useEffect } from 'react';
// Fix: Correct typo in component import.
import { RhiveLogo } from './icons';

export const LoadingPage: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("INITIALIZING AI CORE...");
    
    useEffect(() => {
        const messages = ["GENERATING COST BREAKDOWN...", "ANALYZING IMAGERY...", "CONSTRUCTING 3D MODEL...", "CALCULATING MEASUREMENTS..."];
        let messageIndex = 0;

        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                if (Math.floor(p / 25) > messageIndex) {
                    messageIndex++;
                    setMessage(messages[messageIndex % messages.length]);
                }
                return p + 1;
            });
        }, 35); // Approx 3.5s total load time

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-4 animate-fade-in">
            <div className="relative w-64 h-64 flex justify-center items-center">
                <div className="absolute animate-spin-slow" style={{ animationDuration: '10s' }}>
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <path id="hex" d="M100 2.5 L195.5 51.25 V148.75 L100 197.5 L4.5 148.75 V51.25 Z" fill="none" stroke="#ec028b" strokeWidth="1" />
                    </svg>
                </div>
                {/* Fix: Correct typo in component name. */}
                <RhiveLogo className="h-20 w-20 animate-pulse" />
            </div>
            <div className="mt-8 text-center">
                <p className="text-lg tracking-widest text-gray-400">{message}</p>
                <p className="text-5xl font-bold text-[#ec028b] mt-2">{progress}%</p>
            </div>
        </div>
    );
};