'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, GraduationCap, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stats = [
  { icon: BookOpen, value: '١٢٠+', label: 'دورة تعليمية' },
  { icon: Users, value: '٥٠,٠٠٠+', label: 'طالب مسجل' },
  { icon: GraduationCap, value: '٣٥+', label: 'معلم خبير' },
];

function FlaskIllustration() {
  return (
    <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px] mx-auto">
      <defs>
        <linearGradient id="flask-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="liquid-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Flask body - Erlenmeyer conical flask */}
      <path
        d="M160 100 L160 140 L180 170 Q200 200 200 240 L200 300 Q200 330 170 340 L150 345 Q120 350 120 340 L120 300 Q120 270 100 240 L80 170 Q60 140 60 100 Z"
        stroke="#1e40af"
        strokeWidth="1.5"
        fill="url(#flask-grad)"
        strokeLinejoin="round"
      />

      {/* Neck lines (measurement marks) */}
      <line x1="105" y1="130" x2="135" y2="130" stroke="#1e40af" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="100" y1="150" x2="140" y2="150" stroke="#1e40af" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="95" y1="170" x2="145" y2="170" stroke="#1e40af" strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Liquid */}
      <path
        d="M124 310 Q124 340 150 343 L170 345 Q196 342 196 310 Z"
        stroke="#1e40af"
        strokeWidth="0.8"
        fill="url(#liquid-grad)"
        strokeOpacity="0.4"
      />

      {/* Liquid surface */}
      <line x1="124" y1="310" x2="196" y2="310" stroke="#1e40af" strokeWidth="1" strokeOpacity="0.25" />

      {/* Rim at top */}
      <line x1="55" y1="100" x2="85" y2="100" stroke="#1e40af" strokeWidth="1.5" />
      <line x1="155" y1="100" x2="185" y2="100" stroke="#1e40af" strokeWidth="1.5" />

      {/* Bubbles */}
      <circle cx="145" cy="325" r="4" stroke="#1e40af" strokeWidth="0.6" fill="none" strokeOpacity="0.2" />
      <circle cx="160" cy="318" r="3" stroke="#1e40af" strokeWidth="0.6" fill="none" strokeOpacity="0.2" />
      <circle cx="175" cy="330" r="2.5" stroke="#1e40af" strokeWidth="0.6" fill="none" strokeOpacity="0.15" />

      {/* Molecules floating above */}
      <g strokeOpacity="0.15" fill="none" stroke="#1e40af" strokeWidth="0.6">
        {/* Small hexagon */}
        <polygon points="220,80 228,74 236,80 236,90 228,96 220,90" />
        {/* Small circle molecule */}
        <circle cx="245" cy="100" r="6" />
        <circle cx="245" cy="100" r="3.5" strokeOpacity="0.1" />
        {/* Small double bond */}
        <line x1="80" y1="60" x2="95" y2="60" />
        <line x1="80" y1="63" x2="95" y2="63" />
        <circle cx="78" cy="61.5" r="2.5" fill="#1e40af" fillOpacity="0.15" />
        <circle cx="97" cy="61.5" r="2.5" fill="#1e40af" fillOpacity="0.15" />
      </g>

      {/* Steam/vapor lines */}
      <path d="M140 200 Q145 190 140 180" stroke="#1e40af" strokeWidth="0.5" strokeOpacity="0.12" fill="none" />
      <path d="M155 195 Q160 183 155 172" stroke="#1e40af" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
      <path d="M125 205 Q120 195 125 185" stroke="#1e40af" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Flask illustration */}
          <div className="flex items-center justify-center lg:order-1">
            <div className="relative">
              <FlaskIllustration />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-px bg-[#1e40af]/10" />
            </div>
          </div>

          {/* Right: Text content */}
          <div className="lg:order-2 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eef2ff] border border-[#e5e7eb] text-[#1e40af] text-sm font-medium mb-6">
              <Beaker className="w-4 h-4" />
              منصة تعليم الكيمياء الأولى في العالم العربي
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e293b] leading-tight mb-6">
              أتقن علم{' '}
              <span className="text-[#1e40af]">الكيمياء</span>
              <br />
              برحلة تعليمية تفاعلية
            </h1>

            <p className="text-lg text-[#475569] max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              منصة متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل مع أفضل المعلمين
              لطلاب الكيمياء في جميع المراحل التعليمية
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-12">
              <Link href="/courses">
                <Button variant="default" size="xl">
                  ابدأ التعلم الآن
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="secondary" size="xl">
                  تصفح المسارات
                </Button>
              </Link>
            </div>

            <div className="max-w-md mx-auto lg:mx-0 mb-14">
              <div className="relative">
                <Input
                  placeholder="ابحث عن دورات في الكيمياء..."
                  className="h-12 pr-12 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-[#e5e7eb] bg-[#f8fafc]">
                  <div className="w-10 h-10 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
                    <stat.icon className="w-5 h-5 text-[#1e40af]" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#1e293b]">{stat.value}</p>
                    <p className="text-xs text-[#94a3b8]">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
