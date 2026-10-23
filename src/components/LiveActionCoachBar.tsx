import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Volume2, VolumeX, RefreshCw, Zap, Wand2, Compass } from 'lucide-react';
import { ActionCoachFeedback, STEP_COACH_RULES, speakCoachPrompt } from '../utils/liveMakeupCoach';

interface LiveActionCoachBarProps {
  currentStep: number;
  onSelectStep?: (step: number) => void;
  onHighlightZoneChange?: (zone: string) => void;
}

export const LiveActionCoachBar: React.FC<LiveActionCoachBarProps> = ({
  currentStep,
  onSelectStep,
  onHighlightZoneChange,
}) => {
  const [isAutoLiveActive, setIsAutoLiveActive] = useState<boolean>(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number>(0);
  const [isCurrentlyCorrect, setIsCurrentlyCorrect] = useState<boolean>(true);

  const stepRules = STEP_COACH_RULES[currentStep] || STEP_COACH_RULES[1];

  // Dynamic feedback object
  const currentScenario = isCurrentlyCorrect
    ? stepRules.correctScenarios[activeFeedbackIndex % stepRules.correctScenarios.length]
    : stepRules.mistakeScenarios[activeFeedbackIndex % stepRules.mistakeScenarios.length];

  const blendingScore = isCurrentlyCorrect ? 94 + (activeFeedbackIndex % 5) : 71 - (activeFeedbackIndex % 4);
  const symmetryScore = isCurrentlyCorrect ? 96 - (activeFeedbackIndex % 3) : 68 - (activeFeedbackIndex % 5);

  // Notify parent of active zone
  useEffect(() => {
    if (onHighlightZoneChange) {
      onHighlightZoneChange(stepRules.targetZone);
    }
  }, [currentStep, stepRules.targetZone, onHighlightZoneChange]);

  // Voice announcement on state change if enabled
  useEffect(() => {
    if (isVoiceEnabled && currentScenario) {
      speakCoachPrompt(`${currentScenario.headline}. ${currentScenario.fixAction}`);
    }
  }, [currentStep, isCurrentlyCorrect, activeFeedbackIndex, isVoiceEnabled]);

  // Trigger evaluation cycle
  const handleEvaluateAction = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      // Toggle between correct and actionable feedback for dynamic demonstration
      setIsCurrentlyCorrect((prev) => !prev);
      setActiveFeedbackIndex((prev) => prev + 1);
    }, 600);
  };

  return (
    <div className="w-full bg-stone-900/95 border border-stone-800 rounded-2xl p-4 shadow-xl text-stone-100 space-y-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isCurrentlyCorrect ? 'bg-emerald-400' : 'bg-amber-400'
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isCurrentlyCorrect ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-amber-300">
            DYNAMIC LIVE MAKEUP COACH
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono">
            Target: {stepRules.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Coach Toggle */}
          <button
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (nextState) {
                speakCoachPrompt(`Voice Coach activated for ${stepRules.name}`);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
              isVoiceEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
            title="Spoken Hands-Free Audio Guidance"
          >
            {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isVoiceEnabled ? 'Voice: ON' : 'Voice: Mute'}</span>
          </button>

          {/* Evaluate Action Button */}
          <button
            onClick={handleEvaluateAction}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-medium text-xs shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Analyzing Stroke...' : 'Evaluate Stroke Now'}</span>
          </button>
        </div>
      </div>

      {/* Main Dynamic Status Banner */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          isCurrentlyCorrect
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {isCurrentlyCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h4
                className={`text-sm font-semibold tracking-wide ${
                  isCurrentlyCorrect ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {currentScenario.headline}
              </h4>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                  isCurrentlyCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isCurrentlyCorrect ? 'CORRECT TECHNIQUE' : 'ACTION NEEDED'}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">{currentScenario.detail}</p>
            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium">
              <span className={isCurrentlyCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                ★ Live Fix/Pro Tip:
              </span>
              <span className="text-stone-200">{currentScenario.fixAction}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Quality Meters: Blending & Symmetry */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
            <span>Blending Gradient</span>
            <span className={blendingScore > 80 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {blendingScore}%
            </span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                blendingScore > 80 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${blendingScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
            <span>Bilateral Symmetry</span>
            <span className={symmetryScore > 80 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {symmetryScore}%
            </span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                symmetryScore > 80 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${symmetryScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Selector Ribbon */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-800 overflow-x-auto text-[11px] font-mono">
        {[1, 2, 3, 4, 5].map((step) => {
          const rule = STEP_COACH_RULES[step];
          const isActive = currentStep === step;
          return (
            <button
              key={step}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-semibold'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              Step {step}: {rule.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
