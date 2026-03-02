import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/PageContainer';
import { PAGE_GROUPS } from '../constants';

// ─── Google Weather API Config ────────────────────────────────────────────────
const GOOGLE_WEATHER_API_KEY = import.meta.env.VITE_GOOGLE_WEATHER_API_KEY || '';
const WEATHER_BASE = 'https://weather.googleapis.com/v1';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TempValue { degrees: number; unit: string; }
interface WindData { direction: { cardinal: string; degrees: number }; speed: { value: number; unit: string }; gust: { value: number; unit: string }; }
interface PrecipData { probability: { percent: number; type: string }; qpf: { quantity: number; unit: string }; }
interface WeatherCondition { iconBaseUri: string; description: { text: string }; type: string; }

interface CurrentConditions {
    currentTime: string;
    isDaytime: boolean;
    weatherCondition: WeatherCondition;
    temperature: TempValue;
    feelsLikeTemperature: TempValue;
    relativeHumidity: number;
    uvIndex: number;
    wind: WindData;
    precipitation: PrecipData;
    visibility: { distance: number; unit: string };
    cloudCover: number;
    airPressure: { meanSeaLevelMillibars: number };
    thunderstormProbability: number;
    currentConditionsHistory: {
        maxTemperature: TempValue;
        minTemperature: TempValue;
    };
}

interface DayForecast {
    displayDate: { year: number; month: number; day: number };
    daytimeForecast: {
        weatherCondition: WeatherCondition;
        precipitation: PrecipData;
        wind: WindData;
        uvIndex: number;
        relativeHumidity: number;
    };
    nighttimeForecast: {
        weatherCondition: WeatherCondition;
        precipitation: PrecipData;
    };
    maxTemperature: TempValue;
    minTemperature: TempValue;
    sunEvents: { sunriseTime: string; sunsetTime: string };
}

interface LocationState {
    lat: number;
    lon: number;
    name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toC = (c: number) => Math.round(c);
const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const getDayName = (d: { year: number; month: number; day: number }, short = false) => {
    const date = new Date(d.year, d.month - 1, d.day);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
};

// Map Google weather type → emoji icon
const weatherIcon = (type: string, isDaytime = true): string => {
    const map: Record<string, string> = {
        CLEAR: isDaytime ? '☀️' : '🌙',
        MOSTLY_CLEAR: isDaytime ? '🌤️' : '🌙',
        PARTLY_CLOUDY: '⛅',
        MOSTLY_CLOUDY: '🌥️',
        CLOUDY: '☁️',
        OVERCAST: '☁️',
        WINDY: '💨',
        RAIN: '🌧️',
        DRIZZLE: '🌦️',
        LIGHT_RAIN: '🌦️',
        HEAVY_RAIN: '🌧️',
        SCATTERED_SHOWERS: '🌦️',
        SHOWERS: '🌧️',
        SNOW: '❄️',
        LIGHT_SNOW: '🌨️',
        HEAVY_SNOW: '❄️',
        SLEET: '🌨️',
        FREEZING_RAIN: '🌨️',
        HAIL: '🌨️',
        THUNDERSTORM: '⛈️',
        TORNADO: '🌪️',
        FOG: '🌫️',
        HAZE: '🌫️',
        SMOKE: '🌫️',
        DUST: '🌫️',
    };
    return map[type] || '🌡️';
};

const uvLabel = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-green-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-red-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatPill = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex flex-col gap-0.5">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</p>
        <p className="text-white font-bold text-base leading-tight">{value}</p>
        {sub && <p className="text-gray-500 text-[11px]">{sub}</p>}
    </div>
);

const ForecastCard = ({ day, isToday }: { day: DayForecast; isToday: boolean }) => {
    const icon = weatherIcon(day.daytimeForecast?.weatherCondition?.type || 'CLEAR');
    const maxC = toC(day.maxTemperature?.degrees ?? 0);
    const minC = toC(day.minTemperature?.degrees ?? 0);
    const rain = day.daytimeForecast?.precipitation?.probability?.percent ?? 0;
    const desc = day.daytimeForecast?.weatherCondition?.description?.text || '';

    return (
        <div className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${isToday
            ? 'bg-gradient-to-b from-[#ec028b]/20 to-black/40 border-[#ec028b]/50 shadow-[0_0_20px_rgba(236,2,139,0.15)]'
            : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}>
            {isToday && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest bg-[#ec028b] text-white px-2 py-0.5 rounded-full">
                    Today
                </span>
            )}
            <p className="text-xs font-semibold text-gray-400 mt-1">{getDayName(day.displayDate, true)}</p>
            <span className="text-3xl">{icon}</span>
            <p className="text-[11px] text-gray-400 text-center leading-tight">{desc}</p>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-bold text-sm">{maxC}°</span>
                <span className="text-gray-600 text-sm">/</span>
                <span className="text-gray-400 text-sm">{minC}°</span>
            </div>
            {rain > 0 && (
                <div className="flex items-center gap-1 text-blue-400 text-[11px]">
                    <span>💧</span>
                    <span>{rain}%</span>
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const WeatherGuideWidgetPage: React.FC = () => {
    const page = PAGE_GROUPS.flatMap(g => g.pages).find(p => p.id === 'E-30');

    const [location, setLocation] = useState<LocationState>({ lat: 39.7392, lon: -104.9903, name: 'Denver, CO' });
    const [searchInput, setSearchInput] = useState('');
    const [units, setUnits] = useState<'imperial' | 'metric'>('metric');
    const [current, setCurrent] = useState<CurrentConditions | null>(null);
    const [forecast, setForecast] = useState<DayForecast[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noKey, setNoKey] = useState(false);

    const fetchWeather = useCallback(async (lat: number, lon: number) => {
        if (!GOOGLE_WEATHER_API_KEY) {
            setNoKey(true);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const unitParam = units === 'imperial' ? '&unitsSystem=IMPERIAL' : '';
            const [currentRes, forecastRes] = await Promise.all([
                fetch(`${WEATHER_BASE}/currentConditions:lookup?key=${GOOGLE_WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lon}${unitParam}`),
                fetch(`${WEATHER_BASE}/forecast/days:lookup?key=${GOOGLE_WEATHER_API_KEY}&location.latitude=${lat}&location.longitude=${lon}&days=7${unitParam}`)
            ]);

            if (!currentRes.ok || !forecastRes.ok) {
                const errData = await currentRes.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API error: ${currentRes.status}`);
            }

            const [currentData, forecastData] = await Promise.all([currentRes.json(), forecastRes.json()]);
            setCurrent(currentData);
            setForecast(forecastData.forecastDays || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    }, [units]);

    useEffect(() => {
        fetchWeather(location.lat, location.lon);
    }, [location, fetchWeather]);

    // Geocode city name using Google Geocoding API (same key)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInput.trim() || !GOOGLE_WEATHER_API_KEY) return;
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchInput)}&key=${GOOGLE_WEATHER_API_KEY}`
            );
            const data = await res.json();
            if (data.results?.[0]) {
                const { lat, lng } = data.results[0].geometry.location;
                const name = data.results[0].formatted_address.split(',').slice(0, 2).join(',');
                setLocation({ lat, lon: lng, name });
                setSearchInput('');
            } else {
                setError('Location not found. Try a different city name.');
            }
        } catch {
            setError('Geocoding failed. Check your API key.');
        }
    };

    const useMyLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(pos => {
            setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'My Location' });
        });
    };

    const tempUnit = units === 'imperial' ? '°F' : '°C';
    const displayTemp = (t: TempValue) =>
        units === 'imperial' ? `${Math.round(t.degrees * 9 / 5 + 32)}${tempUnit}` : `${Math.round(t.degrees)}${tempUnit}`;

    const uv = current ? uvLabel(current.uvIndex) : null;

    return (
        <PageContainer
            title={page?.name || 'Weather Guide Widget'}
            description={page?.description || 'Live weather powered by Google Weather API.'}
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── API Key Warning ── */}
                {noKey && (
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-5 text-center space-y-2">
                        <p className="text-yellow-400 font-bold text-lg">⚠️ Google Weather API Key Required</p>
                        <p className="text-gray-400 text-sm">
                            Add your key to your <code className="bg-black/40 px-1.5 py-0.5 rounded text-yellow-300">.env</code> file:
                        </p>
                        <code className="block bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-yellow-300 text-sm font-mono">
                            VITE_GOOGLE_WEATHER_API_KEY=your_google_maps_api_key_here
                        </code>
                        <p className="text-gray-500 text-xs">
                            Enable the <strong className="text-gray-400">Weather API</strong> in your Google Cloud Console → APIs & Services.
                            Then restart the dev server.
                        </p>
                    </div>
                )}

                {/* ── Search & Controls ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search city (e.g. Denver, CO)..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#ec028b]/60 transition-colors"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-[#ec028b]/20 border border-[#ec028b]/50 text-[#ec028b] rounded-xl text-sm font-semibold hover:bg-[#ec028b]/30 transition-all"
                        >
                            Search
                        </button>
                    </form>
                    <button
                        onClick={useMyLocation}
                        className="px-4 py-2.5 bg-black/40 border border-white/10 text-gray-400 rounded-xl text-sm hover:border-white/20 hover:text-white transition-all"
                        title="Use my location"
                    >
                        📍 My Location
                    </button>
                    <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        {(['imperial', 'metric'] as const).map(u => (
                            <button
                                key={u}
                                onClick={() => setUnits(u)}
                                className={`px-4 py-2.5 text-sm font-semibold transition-all ${units === u
                                    ? 'bg-[#ec028b]/20 text-[#ec028b]'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {u === 'imperial' ? '°F' : '°C'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm text-center">
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <div className="w-6 h-6 border-2 border-[#ec028b] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-sm">Fetching weather from Google...</span>
                    </div>
                )}

                {/* ── Current Conditions ── */}
                {!loading && current && (
                    <div className="bg-gradient-to-br from-gray-900/80 to-black/60 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[#ec028b] text-sm font-semibold">📍 {location.name}</span>
                                </div>
                                <div className="flex items-end gap-4">
                                    <span className="text-7xl font-black text-white tracking-tight">
                                        {displayTemp(current.temperature)}
                                    </span>
                                    <div className="pb-2">
                                        <p className="text-gray-300 font-medium">{current.weatherCondition.description.text}</p>
                                        <p className="text-gray-500 text-sm">
                                            Feels like {displayTemp(current.feelsLikeTemperature)}
                                        </p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            H: {displayTemp(current.currentConditionsHistory.maxTemperature)} &nbsp;·&nbsp;
                                            L: {displayTemp(current.currentConditionsHistory.minTemperature)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-6xl">
                                    {weatherIcon(current.weatherCondition.type, current.isDaytime)}
                                </span>
                                <p className="text-gray-600 text-xs mt-2">
                                    {new Date(current.currentTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric', minute: '2-digit', hour12: true
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatPill
                                label="Humidity"
                                value={`${current.relativeHumidity}%`}
                                sub="Relative"
                            />
                            <StatPill
                                label="Wind"
                                value={`${Math.round(current.wind.speed.value)} ${current.wind.speed.unit === 'KILOMETERS_PER_HOUR' ? 'km/h' : 'mph'}`}
                                sub={`${current.wind.direction.cardinal.replace(/_/g, ' ')} · Gust ${Math.round(current.wind.gust.value)}`}
                            />
                            <StatPill
                                label="UV Index"
                                value={`${current.uvIndex}`}
                                sub={uv?.label}
                            />
                            <StatPill
                                label="Visibility"
                                value={`${current.visibility.distance} ${current.visibility.unit === 'KILOMETERS' ? 'km' : 'mi'}`}
                                sub="Clear"
                            />
                            <StatPill
                                label="Rain Chance"
                                value={`${current.precipitation.probability.percent}%`}
                                sub={current.precipitation.probability.type.replace(/_/g, ' ')}
                            />
                            <StatPill
                                label="Cloud Cover"
                                value={`${current.cloudCover}%`}
                                sub="Sky coverage"
                            />
                            <StatPill
                                label="Pressure"
                                value={`${Math.round(current.airPressure.meanSeaLevelMillibars)} mb`}
                                sub="Sea level"
                            />
                            <StatPill
                                label="Thunderstorm"
                                value={`${current.thunderstormProbability}%`}
                                sub="Probability"
                            />
                        </div>
                    </div>
                )}

                {/* ── 7-Day Forecast ── */}
                {!loading && forecast.length > 0 && (
                    <div className="bg-gray-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="text-[#ec028b]">📅</span> 7-Day Forecast
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {forecast.map((day, i) => (
                                <div key={i}>
                                    <ForecastCard day={day} isToday={i === 0} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Sunrise / Sunset ── */}
                {!loading && forecast.length > 0 && forecast[0].sunEvents && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-orange-500/10 to-black/40 border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4">
                            <span className="text-4xl">🌅</span>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Sunrise</p>
                                <p className="text-white font-bold text-xl">{formatTime(forecast[0].sunEvents.sunriseTime)}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/10 to-black/40 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-4">
                            <span className="text-4xl">🌇</span>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Sunset</p>
                                <p className="text-white font-bold text-xl">{formatTime(forecast[0].sunEvents.sunsetTime)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Setup Instructions (when no key) ── */}
                {noKey && (
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-white font-bold">🔧 Setup Instructions</h3>
                        <ol className="space-y-3 text-sm text-gray-400 list-decimal list-inside">
                            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-[#ec028b] hover:underline">Google Cloud Console</a></li>
                            <li>Create or select a project → Enable <strong className="text-white">Weather API</strong> under APIs & Services</li>
                            <li>Also enable <strong className="text-white">Geocoding API</strong> (for city search)</li>
                            <li>Go to <strong className="text-white">Credentials</strong> → Create API Key</li>
                            <li>Create a <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">.env</code> file in your project root:</li>
                        </ol>
                        <pre className="bg-black/60 border border-white/10 rounded-xl p-4 text-sm font-mono text-green-400 overflow-x-auto">
                            {`VITE_GOOGLE_WEATHER_API_KEY=AIza...your_key_here`}
                        </pre>
                        <p className="text-gray-600 text-xs">Restart the dev server after adding the key.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default WeatherGuideWidgetPage;