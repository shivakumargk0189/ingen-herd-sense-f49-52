import React from 'react';
import { ArrowRight, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';
import { Animal, formatTemp } from '../types';
import pastureHeroImg from '../assets/images/pasture_hero.jpg';

interface HerdSenseHeroProps {
  onOpenMonitor: () => void;
  onOpenPredictor: () => void;
  onInspectMarigold: () => void;
  marigoldAnimal?: Animal;
  tempUnit: 'C' | 'F';
}

export const HerdSenseHero: React.FC<HerdSenseHeroProps> = ({
  onOpenMonitor,
  onOpenPredictor,
  onInspectMarigold,
  marigoldAnimal,
  tempUnit,
}) => {
  const marigoldTempDisplay = marigoldAnimal 
    ? formatTemp(marigoldAnimal.temp, tempUnit)
    : (tempUnit === 'C' ? '40.2°C' : '104.4°F');

  return (
    <section className="pt-8 pb-16 md:pt-14 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Typography & CTAs matching screenshot */}
        <div className="lg:col-span-6 space-y-6">
          {/* Eyebrow tag */}
          <div className="text-xs uppercase tracking-[0.22em] text-[#59695d] font-mono font-medium">
            IOT &middot; MACHINE LEARNING &middot; ANIMAL WELFARE
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#19241f] leading-[1.06] font-serif">
            Catch disease{' '}
            <span className="italic font-serif font-normal text-[#234e38]">
              before
            </span>{' '}
            the herd shows it.
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="text-base sm:text-lg text-[#4a584f] leading-relaxed max-w-xl font-normal">
            HerdSense collars collect animal health data around the clock. Machine
            learning picks out the patterns that come before illness, so farmers
            can treat one animal early instead of an outbreak later.
          </p>

          {/* Action Buttons matching screenshot */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onOpenMonitor}
              className="bg-[#234e38] hover:bg-[#1b3d2b] text-white px-7 py-3.5 rounded-full text-base font-medium transition-all shadow-md shadow-[#234e38]/20 flex items-center gap-2 group cursor-pointer"
            >
              <span>Open the herd monitor</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={onOpenPredictor}
              className="bg-transparent hover:bg-[#efe8dc] text-[#19241f] border border-[#d6cec0] px-7 py-3.5 rounded-full text-base font-medium transition-all cursor-pointer"
            >
              Try the risk predictor
            </button>
          </div>
        </div>

        {/* Right Column: Hero Landscape Image & Floating Telemetry Card */}
        <div className="lg:col-span-6 relative">
          {/* Landscape Pasture Image */}
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-950/10 border border-[#e5ded0] bg-[#f0ebd9]">
            <img
              src={pastureHeroImg}
              alt="Dairy cows grazing peacefully in misty sunrise pasture"
              className="w-full h-[360px] sm:h-[440px] md:h-[480px] object-cover"
            />
            {/* Subtle gentle vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Telemetry Card matching screenshot */}
          <div
            onClick={onInspectMarigold}
            className="absolute -bottom-6 left-4 sm:left-6 md:left-8 w-[280px] sm:w-[320px] bg-[#fbf9f4]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#e8e0d0] shadow-2xl shadow-[#19241f]/15 hover:scale-[1.02] transition-all cursor-pointer group"
          >
            {/* Header: Tag, Name & Risk Badge */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[11px] font-mono text-[#6c7b70] block">
                  KB-0417
                </span>
                <h3 className="text-lg font-bold text-[#19241f] group-hover:text-[#234e38] transition-colors">
                  Marigold
                </h3>
              </div>

              {/* Badge: Mastitis 99% with red indicator dot */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                Mastitis 99%
              </span>
            </div>

            {/* Sparkline & Temperature */}
            <div className="flex items-center justify-between gap-4 py-1.5">
              <div className="flex items-center gap-1.5">
                <Thermometer size={18} className="text-[#dc2626]" />
                <span className="text-xl font-bold font-mono text-[#19241f]">
                  {marigoldTempDisplay}
                </span>
              </div>

              {/* Red Rising Sparkline matching screenshot */}
              <div className="w-28 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                  <path
                    d="M 0,22 Q 15,23 30,21 T 60,19 T 80,12 L 100,4"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="4" r="3" fill="#dc2626" />
                </svg>
              </div>
            </div>

            {/* Micro Caption */}
            <p className="text-[11px] text-[#637267] mt-2 pt-2 border-t border-[#eadeca] leading-tight">
              Temperature last 48 h, flagged before symptoms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
