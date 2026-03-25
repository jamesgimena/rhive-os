/// <reference types="vite/client" />
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─── Config ────────────────────────────────────────────────────────────────────
const GOOGLE_WEATHER_API_KEY = import.meta.env.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DisplayDate { year: number; month: number; day: number; }

interface DayForecast {
    displayDate: DisplayDate;
    daytimeForecast: {
        weatherCondition: { type: string; description: { text: string } };
        precipitation: { probability: { percent: number }; qpf: { quantity: number; unit: string } };
        wind: { direction: { cardinal: string }; speed: { value: number; unit: string }; gust: { value: number; unit: string } };
        uvIndex: number;
        relativeHumidity: number;
    };
    nighttimeForecast: {
        weatherCondition: { type: string; description: { text: string } };
        precipitation: { probability: { percent: number } };
    };
    maxTemperature: { degrees: number; unit: string };
    minTemperature: { degrees: number; unit: string };
    sunEvents?: { sunriseTime: string; sunsetTime: string };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const toF = (f: number) => Math.round(f);

const getDayLabel = (d: DisplayDate) => {
    const date = new Date(d.year, d.month - 1, d.day);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'TODAY';
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'TMR';
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const getFullDayName = (d: DisplayDate) => {
    const date = new Date(d.year, d.month - 1, d.day);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getMonthDay = (d: DisplayDate) => {
    const date = new Date(d.year, d.month - 1, d.day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const weatherEmoji = (type: string): string => {
    const map: Record<string, string> = {
        CLEAR: '☀️', MOSTLY_CLEAR: '🌤️', PARTLY_CLOUDY: '⛅',
        MOSTLY_CLOUDY: '🌥️', CLOUDY: '☁️', OVERCAST: '☁️',
        WINDY: '💨', RAIN: '🌧️', DRIZZLE: '🌦️', LIGHT_RAIN: '🌦️',
        HEAVY_RAIN: '🌧️', SCATTERED_SHOWERS: '🌦️', SHOWERS: '🌧️',
        SNOW: '❄️', LIGHT_SNOW: '🌨️', HEAVY_SNOW: '❄️',
        SLEET: '🌨️', FREEZING_RAIN: '🌨️', HAIL: '🌨️',
        THUNDERSTORM: '⛈️', TORNADO: '🌪️', FOG: '🌫️',
        HAZE: '🌫️', SMOKE: '🌫️', DUST: '🌫️',
    };
    return map[type] || '🌡️';
};

const uvLabel = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: '#4ade80' };
    if (uv <= 5) return { label: 'Moderate', color: '#facc15' };
    if (uv <= 7) return { label: 'High', color: '#fb923c' };
    if (uv <= 10) return { label: 'Very High', color: '#f87171' };
    return { label: 'Extreme', color: '#c084fc' };
};

// ─── Popover (rendered via portal into document.body) ─────────────────────────
interface PopoverProps {
    day: DayForecast;
    isToday: boolean;
    /** Live viewport rect of the chip that triggered this popover */
    chipRect: DOMRect;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const WeatherPopover: React.FC<PopoverProps> = ({
    day, isToday, chipRect, onMouseEnter, onMouseLeave,
}) => {
    const POP_W = 256;

    // Compute position from the real viewport rect – no stacking context interference
    const rawLeft = chipRect.left + chipRect.width / 2 - POP_W / 2;
    const left = Math.max(8, Math.min(rawLeft, window.innerWidth - POP_W - 8));
    const top = chipRect.bottom; // 0 px gap — sits flush below the chip

    const type = day.daytimeForecast?.weatherCondition?.type || 'CLEAR';
    const nightType = day.nighttimeForecast?.weatherCondition?.type || 'CLEAR';
    const maxF = toF(day.maxTemperature?.degrees ?? 0);
    const minF = toF(day.minTemperature?.degrees ?? 0);
    const desc = day.daytimeForecast?.weatherCondition?.description?.text || '';
    const nightDesc = day.nighttimeForecast?.weatherCondition?.description?.text || '';
    const rain = day.daytimeForecast?.precipitation?.probability?.percent ?? 0;
    const nightRain = day.nighttimeForecast?.precipitation?.probability?.percent ?? 0;
    const wind = day.daytimeForecast?.wind?.speed?.value ?? 0;
    const windUnit = day.daytimeForecast?.wind?.speed?.unit === 'KILOMETERS_PER_HOUR' ? 'km/h' : 'mph';
    const gust = day.daytimeForecast?.wind?.gust?.value ?? 0;
    const windDir = day.daytimeForecast?.wind?.direction?.cardinal?.replace(/_/g, ' ') || '';
    const humidity = day.daytimeForecast?.relativeHumidity ?? 0;
    const uv = day.daytimeForecast?.uvIndex ?? 0;
    const uvInfo = uvLabel(uv);

    const stats = [
        { icon: '💧', label: 'Rain Day', value: `${rain}%` },
        { icon: '🌙', label: 'Rain Night', value: `${nightRain}%` },
        { icon: '💨', label: 'Wind', value: `${Math.round(wind)} ${windUnit}` },
        { icon: '🌪️', label: 'Gust', value: `${Math.round(gust)} ${windUnit}` },
        { icon: '🧭', label: 'Direction', value: windDir || '—' },
        { icon: '💦', label: 'Humidity', value: `${humidity}%` },
        { icon: '🔆', label: 'UV Index', value: `${uv}` },
        { icon: '🌡️', label: 'UV Level', value: uvInfo.label, valueColor: uvInfo.color },
    ];

    const popover = (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                position: 'fixed',   // direct child of body, no ancestor interference
                top,
                left,
                width: POP_W,
                zIndex: 99999,
                animation: 'wpopIn 0.16s cubic-bezier(0.34,1.56,0.64,1) both',
                pointerEvents: 'auto',
            }}
        >
            <style>{`
                @keyframes wpopIn {
                    from { opacity:0; transform:translateY(-5px) scale(0.96); }
                    to   { opacity:1; transform:translateY(0)    scale(1);    }
                }
            `}</style>

            <div style={{
                background: 'linear-gradient(140deg,rgba(8,6,16,0.98) 0%,rgba(16,8,28,0.98) 100%)',
                border: `1px solid ${isToday ? 'rgba(236,2,139,0.5)' : 'rgba(255,255,255,0.13)'}`,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: isToday
                    ? '0 16px 48px rgba(0,0,0,0.9), 0 0 24px rgba(236,2,139,0.2)'
                    : '0 16px 48px rgba(0,0,0,0.9)',
                backdropFilter: 'blur(24px)',
            }}>

                {/* Header */}
                <div style={{
                    padding: '12px 14px 10px',
                    background: isToday
                        ? 'linear-gradient(135deg,rgba(236,2,139,0.14),transparent)'
                        : 'linear-gradient(135deg,rgba(255,255,255,0.04),transparent)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                }}>
                    <div>
                        <p style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: isToday ? '#ec028b' : 'rgba(255,255,255,0.5)',
                            lineHeight: 1, marginBottom: 2,
                        }}>
                            {getFullDayName(day.displayDate)}
                        </p>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.26)', lineHeight: 1, marginBottom: 8 }}>
                            {getMonthDay(day.displayDate)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                            <span style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{maxF}°F</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.36)', fontWeight: 500 }}>/ {minF}°F</span>
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.3 }}>{desc}</p>
                    </div>
                    <span style={{ fontSize: 30, lineHeight: 1, marginTop: 2 }}>{weatherEmoji(type)}</span>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {stats.map(({ icon, label, value, valueColor }, idx) => (
                        <div key={idx} style={{
                            padding: '7px 12px',
                            background: 'rgba(0,0,0,0.28)',
                            borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            borderBottom: idx < stats.length - 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}>
                            <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>
                                {icon} {label}
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 700, color: valueColor || 'rgba(255,255,255,0.88)', lineHeight: 1 }}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tonight */}
                <div style={{
                    padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: day.sunEvents ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                    <span style={{ fontSize: 15 }}>{weatherEmoji(nightType)}</span>
                    <div>
                        <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Tonight</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{nightDesc || 'Clear'}</p>
                    </div>
                </div>

                {/* Sunrise / Sunset */}
                {day.sunEvents && (
                    <div style={{ display: 'flex', padding: '8px 14px', gap: 10 }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>🌅</span>
                            <div>
                                <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Sunrise</p>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#fb923c' }}>{formatTime(day.sunEvents.sunriseTime)}</p>
                            </div>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>🌇</span>
                            <div>
                                <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Sunset</p>
                                <p style={{ fontSize: 10, fontWeight: 700, color: '#c084fc' }}>{formatTime(day.sunEvents.sunsetTime)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Portal to body — guaranteed no ancestor stacking context interference
    return createPortal(popover, document.body);
};

// ─── Main Strip ────────────────────────────────────────────────────────────────
const WeatherForecastStrip: React.FC = () => {
    const [forecast, setForecast] = useState<DayForecast[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [chipRect, setChipRect] = useState<DOMRect | null>(null);

    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLeave = () => {
        if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    };
    const scheduleClose = () => {
        clearLeave();
        leaveTimer.current = setTimeout(() => setHoveredIdx(null), 100);
    };

    const fetchForecast = useCallback(async () => {
        if (!GOOGLE_WEATHER_API_KEY) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}` +
                `&location.latitude=${DEFAULT_LAT}&location.longitude=${DEFAULT_LON}&days=7&unitsSystem=IMPERIAL`
            );
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            setForecast(data.forecastDays || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchForecast(); }, [fetchForecast]);
    useEffect(() => () => clearLeave(), []);

    if (!GOOGLE_WEATHER_API_KEY || error) return null;

    if (loading) {
        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg bg-white/5 animate-pulse" style={{ minWidth: 44 }}>
                        <div className="w-8 h-2 bg-white/10 rounded" />
                        <div className="w-5 h-4 bg-white/10 rounded" />
                        <div className="w-7 h-2 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (forecast.length === 0) return null;

    return (
        <>
            <div className="flex items-center gap-1" style={{ fontSize: 0 }}>
                {forecast.map((day, i) => {
                    const isToday = i === 0;
                    const isHovered = hoveredIdx === i;
                    const type = day.daytimeForecast?.weatherCondition?.type || 'CLEAR';
                    const maxF = toF(day.maxTemperature?.degrees ?? 0);
                    const minF = toF(day.minTemperature?.degrees ?? 0);

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-150 cursor-default select-none"
                            style={{
                                minWidth: 46,
                                background: isHovered
                                    ? 'rgba(236,2,139,0.18)'
                                    : isToday
                                        ? 'linear-gradient(135deg,rgba(236,2,139,0.18) 0%,rgba(0,0,0,0.3) 100%)'
                                        : 'rgba(255,255,255,0.03)',
                                border: isHovered
                                    ? '1px solid rgba(236,2,139,0.55)'
                                    : isToday
                                        ? '1px solid rgba(236,2,139,0.4)'
                                        : '1px solid rgba(255,255,255,0.06)',
                                boxShadow: isHovered ? '0 0 10px rgba(236,2,139,0.2)' : 'none',
                            }}
                            onMouseEnter={e => {
                                clearLeave();
                                // Capture the LIVE viewport rect right at hover time
                                setChipRect((e.currentTarget as HTMLDivElement).getBoundingClientRect());
                                setHoveredIdx(i);
                            }}
                            onMouseLeave={scheduleClose}
                        >
                            <span style={{
                                fontSize: 8, fontWeight: 800, letterSpacing: '0.12em',
                                color: isToday || isHovered ? '#ec028b' : 'rgba(255,255,255,0.45)',
                                lineHeight: 1,
                            }}>
                                {getDayLabel(day.displayDate)}
                            </span>

                            <span style={{ fontSize: 14, lineHeight: 1.2 }}>{weatherEmoji(type)}</span>

                            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', lineHeight: 1, letterSpacing: '0.05em' }}>
                                {getMonthDay(day.displayDate)}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{maxF}°F</span>
                                <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>/</span>
                                <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>{minF}°F</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Portalled popover — rendered directly into document.body, zero ancestor interference */}
            {hoveredIdx !== null && chipRect && forecast[hoveredIdx] && (
                <WeatherPopover
                    day={forecast[hoveredIdx]}
                    isToday={hoveredIdx === 0}
                    chipRect={chipRect}
                    onMouseEnter={clearLeave}
                    onMouseLeave={scheduleClose}
                />
            )}
        </>
    );
};

export default WeatherForecastStrip;
