import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import { ChartBarIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';
import { projectService } from '../lib/firebaseService';

// ─── Weather Config (reuses same env key) ─────────────────────────────────────
const GOOGLE_WEATHER_API_KEY = (import.meta as any).env?.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;

// Conditions we consider "storm-level"
const STORM_TYPES = new Set([
    'THUNDERSTORM', 'TORNADO', 'HEAVY_RAIN', 'HAIL', 'FREEZING_RAIN',
    'HEAVY_SNOW', 'SLEET', 'SHOWERS', 'SCATTERED_SHOWERS',
]);

interface WeatherAlertState {
    isStorm: boolean;
    condition: string;
    description: string;
    rainChance: number;
    thunderProb: number;
    icon: string;
}

const stormIcon: Record<string, string> = {
    THUNDERSTORM: '⛈️', TORNADO: '🌪️', HEAVY_RAIN: '🌧️', HAIL: '🌨️',
    FREEZING_RAIN: '🌨️', HEAVY_SNOW: '❄️', SLEET: '🌨️',
    SHOWERS: '🌧️', SCATTERED_SHOWERS: '🌦️',
};

// ─── Storm Alert Notification Widget ──────────────────────────────────────────
const StormAlertWidget: React.FC = () => {
    const [alertEnabled, setAlertEnabled] = useState(true);
    const [alertState, setAlertState] = useState<WeatherAlertState>({
        isStorm: false, condition: '', description: '', rainChance: 0, thunderProb: 0, icon: '🌤️',
    });
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [pulse, setPulse] = useState(false);
    const pulseTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchAlert = useCallback(async () => {
        if (!alertEnabled) return;
        if (!GOOGLE_WEATHER_API_KEY) {
            // Demo / mock mode – simulate storm when no API key
            setAlertState({
                isStorm: true,
                condition: 'THUNDERSTORM',
                description: 'Severe Thunderstorm Warning',
                rainChance: 85,
                thunderProb: 72,
                icon: '⛈️',
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${WEATHER_BASE}/currentConditions:lookup?key=${GOOGLE_WEATHER_API_KEY}` +
                `&location.latitude=${DEFAULT_LAT}&location.longitude=${DEFAULT_LON}&unitsSystem=METRIC`
            );
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            const cond = data.weatherCondition?.type || 'CLEAR';
            const desc = data.weatherCondition?.description?.text || cond;
            const rain = data.precipitation?.probability?.percent ?? 0;
            const thunder = data.thunderstormProbability ?? 0;
            const isStorm = STORM_TYPES.has(cond) || thunder >= 40;

            setAlertState({
                isStorm,
                condition: cond,
                description: desc,
                rainChance: rain,
                thunderProb: thunder,
                icon: stormIcon[cond] || (isStorm ? '⚠️' : '🌤️'),
            });
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [alertEnabled]);

    // Fetch on mount + every 10 min
    useEffect(() => {
        fetchAlert();
        const interval = setInterval(fetchAlert, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchAlert]);

    // Pulse effect when storm is active and alert is enabled
    useEffect(() => {
        if (alertState.isStorm && alertEnabled) {
            let on = true;
            pulseTimer.current = setInterval(() => {
                setPulse(p => !p);
            }, 1200);
        } else {
            if (pulseTimer.current) clearInterval(pulseTimer.current);
            setPulse(false);
        }
        return () => { if (pulseTimer.current) clearInterval(pulseTimer.current); };
    }, [alertState.isStorm, alertEnabled]);

    const isActive = alertEnabled && alertState.isStorm;

    return createPortal(
        <>
            <style>{`
                @keyframes stormPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(251,146,60,0), 0 8px 32px rgba(0,0,0,0.6); }
                    50%       { box-shadow: 0 0 0 8px rgba(251,146,60,0.18), 0 8px 32px rgba(0,0,0,0.6); }
                }
                @keyframes stormGlow {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.65; }
                }
                @keyframes stormSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes stormBadgePulse {
                    0%, 100% { transform: scale(1); }
                    50%       { transform: scale(1.18); }
                }
                .storm-panel-enter {
                    animation: stormSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                .storm-badge-pulse {
                    animation: stormBadgePulse 1.2s ease-in-out infinite;
                }
            `}</style>

            {/* ── Fixed bottom-right widget ── */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 10,
                    pointerEvents: 'none',
                }}
            >
                {/* Expanded Detail Card */}
                {expanded && alertEnabled && (
                    <div
                        className="storm-panel-enter"
                        style={{
                            pointerEvents: 'auto',
                            width: 280,
                            background: isActive
                                ? 'linear-gradient(145deg, rgba(17,10,0,0.97) 0%, rgba(30,15,0,0.97) 100%)'
                                : 'linear-gradient(145deg, rgba(10,12,20,0.97) 0%, rgba(14,16,28,0.97) 100%)',
                            border: isActive
                                ? '1px solid rgba(251,146,60,0.55)'
                                : '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 18,
                            overflow: 'hidden',
                            boxShadow: isActive
                                ? '0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(251,146,60,0.12)'
                                : '0 8px 40px rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Card Header */}
                        <div style={{
                            padding: '14px 16px 12px',
                            background: isActive
                                ? 'linear-gradient(135deg,rgba(251,146,60,0.14),transparent)'
                                : 'linear-gradient(135deg,rgba(255,255,255,0.04),transparent)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        fontSize: 22,
                                        ...(isActive ? { animation: 'stormGlow 1.2s ease-in-out infinite' } : {}),
                                    }}>
                                        {alertState.icon}
                                    </span>
                                    <div>
                                        <p style={{
                                            fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
                                            textTransform: 'uppercase',
                                            color: isActive ? '#fb923c' : 'rgba(255,255,255,0.55)',
                                            lineHeight: 1,
                                        }}>
                                            {isActive ? '⚠ Storm Alert' : 'Weather Status'}
                                        </p>
                                        <p style={{
                                            fontSize: 9, color: 'rgba(255,255,255,0.3)',
                                            marginTop: 2, lineHeight: 1,
                                        }}>
                                            {loading ? 'Checking...' : 'Live conditions'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setExpanded(false)}
                                    style={{
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, color: 'rgba(255,255,255,0.5)',
                                        width: 24, height: 24, cursor: 'pointer',
                                        fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Condition text */}
                            <p style={{
                                fontSize: 14, fontWeight: 700,
                                color: isActive ? '#fed7aa' : 'rgba(255,255,255,0.8)',
                                lineHeight: 1.25,
                            }}>
                                {alertState.description || (loading ? 'Fetching weather...' : 'No alerts active')}
                            </p>
                        </div>

                        {/* Stats */}
                        {!loading && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                {[
                                    { icon: '💧', label: 'Rain Chance', value: `${alertState.rainChance}%`, color: alertState.rainChance > 60 ? '#60a5fa' : 'rgba(255,255,255,0.8)' },
                                    { icon: '⚡', label: 'Thunder Risk', value: `${alertState.thunderProb}%`, color: alertState.thunderProb > 40 ? '#fbbf24' : 'rgba(255,255,255,0.8)' },
                                ].map(({ icon, label, value, color }, idx) => (
                                    <div key={idx} style={{
                                        padding: '10px 14px',
                                        borderRight: idx === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                    }}>
                                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                                            {icon} {label}
                                        </p>
                                        <p style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Checkbox toggle row */}
                        <div style={{
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderTop: '1px solid rgba(255,255,255,0.07)',
                            background: 'rgba(0,0,0,0.3)',
                        }}>
                            <label
                                htmlFor="storm-alert-toggle"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    cursor: 'pointer', userSelect: 'none',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: 36, height: 20,
                                    }}
                                >
                                    <input
                                        id="storm-alert-toggle"
                                        type="checkbox"
                                        checked={alertEnabled}
                                        onChange={e => setAlertEnabled(e.target.checked)}
                                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                                    />
                                    {/* Custom toggle track */}
                                    <div style={{
                                        position: 'absolute', inset: 0, borderRadius: 10,
                                        background: alertEnabled
                                            ? (isActive ? 'rgba(251,146,60,0.7)' : 'rgba(236,2,139,0.6)')
                                            : 'rgba(255,255,255,0.12)',
                                        transition: 'background 0.25s',
                                        border: alertEnabled
                                            ? (isActive ? '1px solid rgba(251,146,60,0.9)' : '1px solid rgba(236,2,139,0.9)')
                                            : '1px solid rgba(255,255,255,0.18)',
                                    }} />
                                    {/* Thumb */}
                                    <div style={{
                                        position: 'absolute', top: 2, width: 16, height: 16,
                                        borderRadius: '50%', background: '#fff',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                                        transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                        left: alertEnabled ? 18 : 2,
                                    }} />
                                </div>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                                    Storm alerts {alertEnabled ? 'ON' : 'OFF'}
                                </span>
                            </label>

                            <button
                                onClick={fetchAlert}
                                disabled={loading}
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8, color: 'rgba(255,255,255,0.5)',
                                    padding: '4px 8px', cursor: 'pointer', fontSize: 10,
                                    transition: 'all 0.2s',
                                    opacity: loading ? 0.5 : 1,
                                }}
                            >
                                {loading ? '...' : '↻ Refresh'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Main FAB / Badge Button ── */}
                <button
                    id="storm-alert-fab"
                    onClick={() => setExpanded(e => !e)}
                    style={{
                        pointerEvents: 'auto',
                        position: 'relative',
                        width: 56, height: 56,
                        borderRadius: '50%',
                        background: isActive
                            ? 'linear-gradient(135deg,#f97316,#dc2626)'
                            : alertEnabled
                                ? 'linear-gradient(135deg,rgba(236,2,139,0.8),rgba(168,0,80,0.8))'
                                : 'rgba(30,32,44,0.95)',
                        border: isActive
                            ? '2px solid rgba(251,146,60,0.8)'
                            : alertEnabled
                                ? '2px solid rgba(236,2,139,0.6)'
                                : '2px solid rgba(255,255,255,0.12)',
                        boxShadow: expanded
                            ? 'none'
                            : isActive
                                ? '0 0 0 0 rgba(251,146,60,0), 0 6px 24px rgba(0,0,0,0.5)'
                                : '0 6px 20px rgba(0,0,0,0.45)',
                        animation: isActive && !expanded ? 'stormPulse 1.4s ease-in-out infinite' : 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                        transition: 'background 0.3s, border 0.3s, transform 0.15s',
                        transform: expanded ? 'scale(0.92)' : 'scale(1)',
                    }}
                    title={isActive ? 'Storm incoming! Click for details' : 'Weather alert status'}
                >
                    <span style={{ lineHeight: 1, filter: isActive ? 'drop-shadow(0 0 4px rgba(255,200,0,0.7))' : 'none' }}>
                        {alertEnabled
                            ? (isActive ? '⛈️' : '🌤️')
                            : '🔕'}
                    </span>

                    {/* Red dot badge when storm active */}
                    {isActive && alertEnabled && !expanded && (
                        <span
                            className="storm-badge-pulse"
                            style={{
                                position: 'absolute', top: -2, right: -2,
                                width: 14, height: 14, borderRadius: '50%',
                                background: '#ef4444',
                                border: '2px solid rgba(17,24,39,0.9)',
                                boxShadow: '0 0 8px rgba(239,68,68,0.7)',
                            }}
                        />
                    )}
                </button>
            </div>

            {/* ── Full-width storm banner at top of viewport (when storm + enabled) ── */}
            {isActive && !expanded && (
                <div
                    className="storm-panel-enter"
                    style={{
                        position: 'fixed', bottom: 92, right: 24, zIndex: 9998,
                        pointerEvents: 'none',
                        background: 'linear-gradient(90deg,rgba(234,88,12,0.92),rgba(220,38,38,0.92))',
                        border: '1px solid rgba(251,146,60,0.6)',
                        borderRadius: 12,
                        padding: '8px 16px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 16px rgba(251,146,60,0.2)',
                        backdropFilter: 'blur(8px)',
                        animation: 'stormGlow 1.4s ease-in-out infinite',
                    }}
                >
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <div>
                        <p style={{
                            fontSize: 10, fontWeight: 800, color: '#fff',
                            textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1,
                        }}>
                            Storm Incoming
                        </p>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', lineHeight: 1.2, marginTop: 1 }}>
                            {alertState.description}
                        </p>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const EmployeeDashboard: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-01');
    const [recentProjects, setRecentProjects] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = projectService.subscribe((data: any[]) => {
            console.log('🔥 Firebase data received:', data);
            console.log('🔥 Number of documents:', data.length);

            const mapped = data.map((p: any) => {
                console.log('📄 Document:', p);
                return {
                    _id: p.id,
                    name: p.name,
                    current_stage: p.current_stage || p.status || 'Lead',
                    status: p.status || 'Active',
                    last_updated: p.updated_at || p.created_at || new Date().toISOString()
                };
            });

            const sorted = mapped.sort((a: any, b: any) =>
                new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
            ).slice(0, 5);

            console.log('✅ Sorted projects for display:', sorted);
            setRecentProjects(sorted);
        });
        return () => unsubscribe();
    }, []);

    const timeAgo = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <PageContainer title={page?.name || 'Employee Dashboard'} description={page?.description || 'Your personal performance analytics.'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Performance Card */}
                <Card title="Sales Performance (Q3)" className="lg:col-span-2">
                    <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-16 h-16 text-gray-700" />
                        <p className="absolute text-gray-500">Sales Chart Placeholder</p>
                    </div>
                </Card>

                {/* KPIs Card */}
                <Card title="Key Metrics">
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Quotes Sent This Month</p>
                            <p className="text-2xl font-bold text-white">42</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Contracts Signed</p>
                            <p className="text-2xl font-bold text-white">18</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="text-sm text-gray-400">Close Rate</p>
                            <p className="text-2xl font-bold text-green-400">42.8%</p>
                        </div>
                    </div>
                </Card>

                {/* Project Statuses Card */}
                <Card title="Project Status Overview">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Lead</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="font-bold text-white">120</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Quote</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <span className="font-bold text-white">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">In Progress</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-[#ec028b] h-2.5 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                            <span className="font-bold text-white">25</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Completed</span>
                            <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="font-bold text-white">88</span>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity Card */}
                <Card title="Recent Activity" className="lg:col-span-2">
                    <div className="space-y-6">
                        {recentProjects.map((project) => (
                            <div key={project._id} className="flex items-start gap-4 border-b border-gray-800/50 pb-6 last:border-0 last:pb-0 group">
                                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[#ec028b] shadow-[0_0_10px_#ec028b] shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-300 leading-relaxed">
                                        <span className="font-bold text-white">New Lead</span> submitted form <span className="font-bold text-[#ec028b]">{project.name}</span>.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{timeAgo(project.last_updated)}</p>
                                </div>
                            </div>
                        ))}
                        {recentProjects.length === 0 && (
                            <div className="text-center py-8 text-gray-500 italic">No recent activity found.</div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Storm Alert Widget — fixed in bottom-right, portalled to document.body */}
            <StormAlertWidget />
        </PageContainer>
    );
};

export default EmployeeDashboard;