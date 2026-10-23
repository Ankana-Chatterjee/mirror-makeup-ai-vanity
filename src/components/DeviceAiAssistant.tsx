import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Mic, Play, MessageSquare, Bot, Cpu } from 'lucide-react';
import { FaceDiagnostics, MakeupLook } from '../types/makeup';

interface DeviceAiAssistantProps {
  diagnostics: FaceDiagnostics;
  currentLook: MakeupLook;
  isDispensing: boolean;
  onTriggerDispense: () => void;
}

export const DeviceAiAssistant: React.FC<DeviceAiAssistantProps> = ({
  diagnostics,
  currentLook,
  isDispensing,
  onTriggerDispense,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAssistantSpeech, setCurrentAssistantSpeech] = useState<string>(
    `Hello! Mirror Makeup autonomous biometric scan is complete. I have detected your ${diagnostics.skinToneName} with ${diagnostics.eyeShape} eyes and ${diagnostics.darkCircleHue.replace('-', ' ')} under-eye hue. Color tanks are pressurized and ready to dispense your custom foundation, color corrector, and lipstick.`
  );

  // Update speech when diagnostics change
  useEffect(() => {
    setCurrentAssistantSpeech(
      `Autonomous scan updated: Detected ${diagnostics.skinToneName} (${diagnostics.skinUndertone} undertone), ${diagnostics.eyeShape} architecture with floating crease at +${diagnostics.floatingCreaseOffsetMm}mm, and ${diagnostics.darkCircleHue.replace('-', ' ')} circles. Color tanks are ready to formulate ${currentLook.name}.`
    );
  }, [diagnostics.skinToneName, diagnostics.eyeShape, diagnostics.darkCircleHue, currentLook.name]);

  // Text-To-Speech execution
  const speakText = (text: string) => {
    setCurrentAssistantSpeech(text);
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Zira')));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-stone-900" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
              ON-BOARD HARDWARE AI ASSISTANT
            </div>
            <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
              Mirror Intelligence OS
            </h2>
          </div>
        </div>

        {/* Audio Mute/Unmute & Status */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
              <span className="w-1.5 h-3 bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-4 bg-emerald-400 animate-bounce delay-75" />
              <span className="w-1.5 h-2 bg-emerald-400 animate-bounce delay-150" />
              <span className="ml-1">SPEAKING</span>
            </div>
          )}

          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsMuted(!isMuted);
            }}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-stone-800 border-stone-700 text-stone-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
            }`}
            title={isMuted ? 'Unmute Assistant' : 'Mute Assistant'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AI Assistant Spoken Output Box */}
      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Voice & Touch Consultation</span>
          </span>
          <span>Latency: 8ms Neural Engine</span>
        </div>

        <p className="text-xs text-stone-200 leading-relaxed font-sans">
          "{currentAssistantSpeech}"
        </p>

        {/* Quick Voice Prompt Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/80 text-xs">
          <span className="text-stone-500 text-[11px]">Quick Audio Briefs:</span>
          
          <button
            onClick={() =>
              speakText(
                `Your ${diagnostics.skinToneName} has a distinct ${diagnostics.skinUndertone} undertone. We formulate your custom foundation by drawing from the White, Yellow, and Olive tanks, which completely prevents the grey or ashy oxidation common with standard makeup.`
              )
            }
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
          >
            🎙️ Explain Undertone
          </button>

          <button
            onClick={() =>
              speakText(
                `For your ${diagnostics.eyeShape} eyes, standard crease makeup folds inward and vanishes. Mirror Makeup projects a floating golden crease 3.5 millimeters above your fold directly onto your orbital bone so your shadow stays visible with open eyes.`
              )
            }
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
          >
            🎙️ Hooded Eye Rule
          </button>

          <button
            onClick={() =>
              speakText(
                `Your under-eye dark circles measure a ${diagnostics.darkCircleHue.replace('-', ' ')} hue. We are dispensing ${diagnostics.darkCircleHue === 'brown-melanin' ? 'Terracotta Orange' : 'Peach Salmon'} corrector into Well B to neutralize the shadow before you apply foundation.`
              )
            }
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
          >
            🎙️ Dark Circle Plan
          </button>

          <button
            onClick={() =>
              speakText(
                `All 7 color and vehicle tanks are calibrated. White is at 90%, Yellow at 85%, Red at 80%, Blue at 85%, and Olive at 75%. You have enough pigment for over 45 custom single-use portions.`
              )
            }
            className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
          >
            🎙️ Tank Levels Status
          </button>
        </div>
      </div>
    </div>
  );
};
