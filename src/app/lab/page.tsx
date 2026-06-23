'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskRound, Beaker, Atom, AlertTriangle, Thermometer, Wind, Droplets,
  Zap, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, Info, ArrowLeft,
  TestTube, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { chemicals, findReaction, getCompoundProperty, type Chemical, type ReactionResult } from '@/data/reactions';

const LabScene = dynamic(() => import('@/components/features/LabScene'), { ssr: false });
type LabState = 'idle' | 'dripping' | 'reacting' | 'intense' | 'peak' | 'chaos' | 'flood' | 'underwater';

const stateLabels: Record<string, string> = {
  idle: 'التجربة جاهزة', dripping: 'إضافة السائل...', reacting: 'بدء التفاعل...',
  intense: 'تفاعل قوي!', peak: 'ذروة التفاعل!', chaos: 'انفجار!',
  flood: 'فيضان!', underwater: 'تحت الماء...',
};

const stateColors: Record<string, string> = {
  idle: 'text-gray-400', dripping: 'text-cyan-400', reacting: 'text-yellow-400',
  intense: 'text-orange-400', peak: 'text-red-400', chaos: 'text-purple-400',
  flood: 'text-blue-400', underwater: 'text-cyan-300',
};

export default function LabPage() {
  const [chemA, setChemA] = useState<string | null>(null);
  const [chemB, setChemB] = useState<string | null>(null);
  const [labState, setLabState] = useState<LabState>('idle');
  const [trigger, setTrigger] = useState(0);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const reaction = useMemo(() => {
    if (!chemA || !chemB) return null;
    return findReaction(chemA, chemB);
  }, [chemA, chemB]);

  const chemAData = useMemo(() => chemicals.find((c) => c.id === chemA), [chemA]);
  const chemBData = useMemo(() => chemicals.find((c) => c.id === chemB), [chemB]);

  const handleStart = useCallback(() => {
    if (!reaction || labState !== 'idle') return;
    setTrigger((t) => t + 1);
  }, [reaction, labState]);

  const handleReset = useCallback(() => {
    setChemA(null);
    setChemB(null);
    setLabState('idle');
    setTrigger(0);
  }, []);

  const canStart = chemA && chemB && labState === 'idle' && reaction;

  const reactionConfig = useMemo(() => {
    if (!reaction) return null;
    return {
      intensity: reaction.intensity,
      gas: reaction.gas,
      heat: reaction.heat,
      colorFrom: reaction.colorFrom,
      colorTo: reaction.colorTo,
    };
  }, [reaction]);

  const typeColors: Record<string, string> = {
    acid: 'from-red-500 to-orange-600',
    base: 'from-blue-500 to-cyan-600',
    metal: 'from-gray-400 to-slate-600',
    salt: 'from-purple-500 to-pink-600',
    other: 'from-green-500 to-emerald-600',
  };

  const typeLabels: Record<string, string> = {
    acid: 'حمض', base: 'قاعدة', metal: 'فلز', salt: 'ملح', other: 'أخرى',
  };

  return (
    <div dir="rtl" className="font-cairo min-h-screen bg-[#080e1a] text-white">
      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">الرئيسية</span>
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <FlaskRound className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                مختبر التفاعلات
              </h1>
            </div>
          </div>
          <Badge variant={labState === 'idle' ? 'cyan' : labState === 'underwater' ? 'green' : 'yellow'}>
            {stateLabels[labState]}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel - Chemicals */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4"
            >
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-cyan-400" />
                اختر المادة الأولى (أ)
              </h2>
              <div className="space-y-1.5">
                {chemicals.map((chem) => (
                  <button
                    key={chem.id}
                    onClick={() => setChemA(chem.id)}
                    className={`w-full text-right flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      chemA === chem.id
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                        : 'bg-white/[0.02] border border-white/5 text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${typeColors[chem.type]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {chem.formula.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{chem.name}</p>
                      <p className="text-[10px] text-gray-500 ltr">{chem.formula}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{typeLabels[chem.type]}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4"
            >
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TestTube className="w-4 h-4 text-cyan-400" />
                اختر المادة الثانية (ب)
              </h2>
              <div className="space-y-1.5">
                {chemicals.map((chem) => (
                  <button
                    key={chem.id}
                    onClick={() => setChemB(chem.id)}
                    disabled={chem.id === chemA}
                    className={`w-full text-right flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      chemB === chem.id
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                        : chem.id === chemA
                          ? 'opacity-30 cursor-not-allowed'
                          : 'bg-white/[0.02] border border-white/5 text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${typeColors[chem.type]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {chem.formula.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{chem.name}</p>
                      <p className="text-[10px] text-gray-500 ltr">{chem.formula}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{typeLabels[chem.type]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Center - 3D Scene */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            >
              <LabScene
                onStateChange={setLabState}
                reaction={reactionConfig}
                trigger={trigger}
              />

              {/* State overlay */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <motion.div
                  key={labState}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/5 ${stateColors[labState]}`}
                >
                  <span className="text-xs font-medium">{stateLabels[labState]}</span>
                </motion.div>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    const el = document.querySelector('canvas');
                    if (el) el.dispatchEvent(new WheelEvent('wheel', { deltaY: -120 }));
                  }}
                  className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('canvas');
                    if (el) el.dispatchEvent(new WheelEvent('wheel', { deltaY: 120 }));
                  }}
                  className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Control buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mt-4"
            >
              <Button
                variant={canStart ? 'primary' : 'secondary'}
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                {labState === 'idle' ? 'ابدأ التفاعل' : 'التفاعل جاري...'}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleReset}
                className="gap-2 text-gray-400"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة تعيين
              </Button>
            </motion.div>
          </div>

          {/* Right Panel - Info */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4"
            >
              <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                تفاصيل التفاعل
              </h2>

              {!chemA || !chemB ? (
                <div className="text-center py-8">
                  <FlaskRound className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">اختر مادتين لبدء التجربة</p>
                </div>
              ) : !reaction ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-10 h-10 text-yellow-500/50 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">هاتان المادتان لا تتفاعلان</p>
                  <p className="text-gray-600 text-xs mt-1">جرب مواد أخرى</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Selected chemicals */}
                  <div className="flex items-center justify-between gap-2 bg-white/[0.02] rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-400">{chemAData?.name}</span>
                    <span className="text-lg text-cyan-400">+</span>
                    <span className="text-xs text-gray-400">{chemBData?.name}</span>
                  </div>

                  {/* Equation */}
                  <div className="bg-white/[0.02] rounded-xl px-3 py-2.5 text-center">
                    <p className="text-sm text-cyan-300 font-mono ltr" dir="ltr">{reaction.equation}</p>
                  </div>

                  {/* Properties */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`bg-white/[0.02] rounded-xl px-3 py-2 text-center ${reaction.gas ? 'border border-cyan-500/10' : ''}`}>
                      <Wind className={`w-4 h-4 mx-auto mb-1 ${reaction.gas ? 'text-cyan-400' : 'text-gray-600'}`} />
                      <p className="text-[10px] text-gray-500">غاز</p>
                      <p className="text-xs font-bold text-white">{reaction.gas ? reaction.gasFormula : '—'}</p>
                    </div>
                    <div className={`bg-white/[0.02] rounded-xl px-3 py-2 text-center ${reaction.heat ? 'border border-orange-500/10' : ''}`}>
                      <Thermometer className={`w-4 h-4 mx-auto mb-1 ${reaction.heat ? 'text-orange-400' : 'text-gray-600'}`} />
                      <p className="text-[10px] text-gray-500">حرارة</p>
                      <p className="text-xs font-bold text-white">{reaction.heat ? reaction.exothermic ? 'طاردة' : 'ماصة' : '—'}</p>
                    </div>
                  </div>

                  {/* Intensity */}
                  <div className="bg-white/[0.02] rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">شدة التفاعل</span>
                      <Badge variant={
                        reaction.intensity === 'high' ? 'red' : reaction.intensity === 'medium' ? 'yellow' : 'green'
                      }>
                        {reaction.intensity === 'high' ? 'قوي' : reaction.intensity === 'medium' ? 'متوسط' : 'ضعيف'}
                      </Badge>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          reaction.intensity === 'high' ? 'bg-red-500' :
                          reaction.intensity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{
                          width: reaction.intensity === 'high' ? '100%' :
                                  reaction.intensity === 'medium' ? '60%' : '30%',
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white/[0.02] rounded-xl px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-300 leading-relaxed">{reaction.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-4"
            >
              <h3 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                <Lightbulb className="w-3 h-3" />
                نصائح
              </h3>
              <ul className="space-y-1.5 text-[11px] text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>اسحب لتدوير المشهد ثلاثي الأبعاد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>استخدم عجلة الماوس للتكبير والتصغير</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>جمع حمض + فلز نشط يعطي غاز الهيدروجين</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>حمض + كربونات يعطي غاز ثاني أكسيد الكربون</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbulb(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>; }
