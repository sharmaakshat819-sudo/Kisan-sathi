import React from 'react';
import { WeatherWarning as IWeatherWarning, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { speakText } from '../utils/speech';
import {
  CloudSunRain,
  AlertTriangle,
  Volume2,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Sun,
  CloudRain,
  CloudLightning,
  CheckCircle2,
} from 'lucide-react';

interface WeatherWarningProps {
  warnings: IWeatherWarning[];
  currentLang: Language;
}

export const WeatherWarning: React.FC<WeatherWarningProps> = ({
  warnings,
  currentLang,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const currentWeather = {
    temp: 29,
    condition: 'Thunderstorm Approaching',
    rainfallProb: 75,
    humidity: 84,
    windSpeed: 28,
    location: 'Nashik / Maharashtra Agricultural Zone',
  };

  const forecast = [
    { day: 'Today', icon: '⛈️', max: 31, min: 21, rain: 75, condition: 'Thunderstorm' },
    { day: 'Tomorrow', icon: '🌧️', max: 27, min: 20, rain: 85, condition: 'Heavy Rain' },
    { day: 'Day 3', icon: '⛅', max: 29, min: 21, rain: 35, condition: 'Scattered Showers' },
    { day: 'Day 4', icon: '☀️', max: 32, min: 22, rain: 10, condition: 'Sunny & Clear' },
    { day: 'Day 5', icon: '☀️', max: 34, min: 23, rain: 5, condition: 'Dry & Warm' },
  ];

  const handleSpeakWarning = (warning: IWeatherWarning) => {
    const text = currentLang === 'hi'
      ? `मौसम चेतावनी: ${warning.title}। ${warning.summary} सलाह: ${warning.actionAdvice}`
      : currentLang === 'mr'
      ? `हवामान इशारा: ${warning.title}। ${warning.summary} सल्ला: ${warning.actionAdvice}`
      : `Weather Warning: ${warning.title}. ${warning.summary}. Recommended Action: ${warning.actionAdvice}`;
    speakText(text, currentLang);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-red-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-950/60 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('weather_forecast')} & Crop Warnings
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              Micro-climate Doppler radar synced warnings to protect against post-harvest and crop spoilage
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/80 px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-xs font-bold text-amber-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
            <span>2 Active Severe Advisories</span>
          </div>
        </div>
      </div>

      {/* Current Conditions Dashboard */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div>
            <span className="text-xs text-stone-500 font-semibold">Live Micro-Climate Station</span>
            <h3 className="text-base font-bold text-stone-900">{currentWeather.location}</h3>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            ⚠️ Alert Level: Orange (Severe Rain Expected)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">Temperature</span>
              <span className="text-xl font-black text-stone-900">{currentWeather.temp}°C</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-800">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">{t('rainfall_prob')}</span>
              <span className="text-xl font-black text-blue-800">{currentWeather.rainfallProb}%</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-xl text-cyan-800">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">{t('humidity')}</span>
              <span className="text-xl font-black text-stone-900">{currentWeather.humidity}%</span>
            </div>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-medium block">{t('wind_speed')}</span>
              <span className="text-xl font-black text-stone-900">{currentWeather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast Grid */}
        <div className="pt-2">
          <span className="text-xs font-bold text-stone-700 block mb-2">
            5-Day Agricultural Weather Outlook:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {forecast.map((fc, i) => (
              <div
                key={i}
                className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/80 text-center space-y-1"
              >
                <span className="text-xs font-bold text-stone-700 block">{fc.day}</span>
                <span className="text-3xl block my-1">{fc.icon}</span>
                <div className="text-xs font-black text-stone-900">
                  {fc.max}° <span className="text-stone-400 font-normal">/ {fc.min}°</span>
                </div>
                <span
                  className={`text-[10px] font-bold block ${
                    fc.rain > 50 ? 'text-red-700' : 'text-stone-500'
                  }`}
                >
                  💧 {fc.rain}% Rain
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Warnings List */}
      <div className="space-y-4">
        <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <span>{t('advisory_alerts')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warnings.map((w) => (
            <div
              key={w.id}
              className={`rounded-2xl p-5 border shadow-sm space-y-3 ${
                w.severity === 'danger'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-white rounded-xl shadow-xs text-xl">
                    {w.severity === 'danger' ? '⚠️' : '🔔'}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">{w.title}</h4>
                    <span className="text-[11px] text-stone-500">{w.timestamp}</span>
                  </div>
                </div>

                {/* Speak Warning Audio Button */}
                <button
                  onClick={() => handleSpeakWarning(w)}
                  aria-label={`Listen to weather warning: ${w.title}`}
                  className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 shadow-xs border border-stone-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Listen in your language"
                >
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">{t('listen')}</span>
                </button>
              </div>

              {/* Impacted Crops */}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="font-bold text-stone-700">Affected Crops:</span>
                {w.impactCrops.map((c) => (
                  <span
                    key={c}
                    className="bg-white/80 border border-stone-200 text-stone-800 text-[11px] px-2 py-0.5 rounded-md font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">{w.summary}</p>

              {/* Recommended Action Checklist */}
              <div className="bg-white/90 p-3.5 rounded-xl border border-stone-200/80 space-y-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('protective_action')}:</span>
                </span>
                <p className="text-xs text-stone-800 font-medium leading-relaxed">
                  {w.actionAdvice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
