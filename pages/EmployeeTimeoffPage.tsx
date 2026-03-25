import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarDaysIcon, BoltIcon } from '../components/icons';
import { PAGE_GROUPS } from '../constants';

// --- Weather Config ---
const GOOGLE_WEATHER_API_KEY = (import.meta as any).env?.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';
const DEFAULT_LAT = 39.7392;
const DEFAULT_LON = -104.9903;

interface WeatherAlert {
    date: string; // YYYY-MM-DD
    type: string;
    description: string;
    isStorm: boolean;
}

const STORM_TYPES = new Set([
    'THUNDERSTORM', 'TORNADO', 'HEAVY_RAIN', 'HAIL', 'FREEZING_RAIN',
    'HEAVY_SNOW', 'SLEET', 'SHOWERS', 'SCATTERED_SHOWERS',
]);

const EmployeeTimeoffPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-04');
    const [weatherAlerts, setWeatherAlerts] = useState<Record<string, WeatherAlert>>({});
    const [loading, setLoading] = useState(false);

    // Dynamic Date Calculation
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthName = now.toLocaleString('default', { month: 'long' });

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const fetchForecast = useCallback(async () => {
        if (!GOOGLE_WEATHER_API_KEY) return;
        setLoading(true);
        try {
            const res = await fetch(
                `${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}` +
                `&location.latitude=${DEFAULT_LAT}&location.longitude=${DEFAULT_LON}&days=7&unitsSystem=METRIC`
            );
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            const alerts: Record<string, WeatherAlert> = {};
            data.forecastDays?.forEach((d: any) => {
                const dateStr = `${d.displayDate.year}-${String(d.displayDate.month).padStart(2, '0')}-${String(d.displayDate.day).padStart(2, '0')}`;
                const cond = d.daytimeForecast?.weatherCondition?.type || 'CLEAR';
                const desc = d.daytimeForecast?.weatherCondition?.description?.text || '';
                const thunderProb = d.daytimeForecast?.thunderstormProbability ?? 0;
                const isStorm = STORM_TYPES.has(cond) || thunderProb >= 40;

                alerts[dateStr] = {
                    date: dateStr,
                    type: cond,
                    description: desc,
                    isStorm
                };
            });
            setWeatherAlerts(alerts);
        } catch (err) {
            console.error('Weather fetch failed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchForecast();
    }, [fetchForecast]);

    return (
        <PageContainer title={page?.name || 'Calendar'} description={page?.description || 'Manage your time off and view team schedules.'}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title={`${monthName} ${currentYear}`}>
                        <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-800">
                            {days.map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty slots for start of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 bg-gray-950/20 border border-gray-900/30 rounded-lg" />
                            ))}

                            {/* Calendar Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                const alert = weatherAlerts[dateStr];
                                const isToday = dayNum === now.getDate();

                                return (
                                    <div
                                        key={dayNum}
                                        className={`h-24 p-2 rounded-lg border transition-all duration-300 relative group flex flex-col justify-between
                                            ${isToday ? 'bg-[#ec028b]/5 border-[#ec028b]/40 shadow-[0_0_15px_rgba(236,2,139,0.1)]' : 'bg-gray-900/40 border-gray-800/40 hover:border-gray-700'}
                                            ${alert?.isStorm ? 'border-orange-500/50 bg-orange-500/5' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-xs font-bold ${isToday ? 'text-[#ec028b]' : 'text-gray-400'}`}>
                                                {dayNum}
                                            </span>
                                            {isToday && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#ec028b] animate-pulse" />
                                            )}
                                        </div>

                                        {/* Weather Alert Content */}
                                        {alert && (
                                            <div className="mt-auto">
                                                {alert.isStorm ? (
                                                    <div className="bg-orange-500/20 border border-orange-500/30 rounded p-1 flex items-center gap-1 group-hover:bg-orange-500/30 transition-colors">
                                                        <BoltIcon className="w-3 h-3 text-orange-400" />
                                                        <span className="text-[8px] font-bold text-orange-200 uppercase truncate">Storm Alert</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 px-1">
                                                        <span className="text-[10px] opacity-60">
                                                            {alert.type === 'CLEAR' ? '☀️' : alert.type === 'PARTLY_CLOUDY' ? '⛅' : '☁️'}
                                                        </span>
                                                        <span className="text-[8px] text-gray-500 uppercase font-medium">{alert.type.replace('_', ' ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Interactive Tooltip on Hover */}
                                        {alert?.isStorm && (
                                            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-center items-center z-10 rounded-lg">
                                                <BoltIcon className="w-5 h-5 text-orange-500 mb-1" />
                                                <p className="text-[8px] font-bold text-orange-400 uppercase text-center">{alert.description}</p>
                                                <p className="text-[7px] text-gray-400 text-center mt-1">Severe Forecast</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Calendar Legend">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div className="w-3 h-3 rounded bg-[#ec028b]" />
                                <span className="text-xs text-gray-300">Today</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg border border-orange-500/30">
                                <div className="w-3 h-3 rounded bg-orange-500" />
                                <span className="text-xs text-gray-300">Storm Forecast</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg border border-blue-500/30">
                                <div className="w-3 h-3 rounded bg-blue-500" />
                                <span className="text-xs text-gray-300">Team Event</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Your Balances">
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-xs">Paid Time Off (PTO)</span>
                                <span className="font-bold text-white text-xs">80 hours</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <span className="text-gray-300 text-xs">Holidays</span>
                                <span className="font-bold text-white text-xs">5 days</span>
                            </div>
                        </div>
                    </Card>

                    <Button size="lg" className="w-full bg-[#ec028b] hover:bg-[#c00270] shadow-[0_0_20px_rgba(236,2,139,0.3)]">
                        <CalendarDaysIcon className="w-5 h-5 mr-2" />
                        Request Time Off
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
};

export default EmployeeTimeoffPage;