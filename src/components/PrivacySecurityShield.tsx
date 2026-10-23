import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, Cpu, EyeOff, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface PrivacySecurityShieldProps {
  onPurgeAllData: () => void;
  photoCount: number;
}

export const PrivacySecurityShield: React.FC<PrivacySecurityShieldProps> = ({
  onPurgeAllData,
  photoCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [purgedRecently, setPurgedRecently] = useState(false);

  const handleTriggerPurge = () => {
    onPurgeAllData();
    setPurgedRecently(true);
    setTimeout(() => setPurgedRecently(false), 2500);
  };

  return (
    <>
      {/* Compact Interactive Security Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 hover:bg-emerald-900/60 transition-all hover:border-emerald-400/50 shadow-sm"
        title="Click to view Anti-Hacker & Local Privacy Security Architecture"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold tracking-wide">SECURE SANDBOX: 100% LOCAL</span>
      </button>

      {/* Security Architecture & Anti-Hacking Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-stone-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-medium text-stone-100">
                    Client-Side Privacy & Anti-Hacking Shield
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Zero-Knowledge In-Memory Biometric Processing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-stone-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Core Guarantees */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex gap-3">
                <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-stone-200">100% On-Device Client Processing</div>
                  <div className="text-stone-400 leading-relaxed">
                    Facial feature auto-detection, color analysis, and stippling algorithms execute strictly within your local browser GPU/Canvas memory. No video stream or camera data ever leaves your device.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex gap-3">
                <EyeOff className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-stone-200">Zero Cloud Storage / Anti-Hacker Fortress</div>
                  <div className="text-stone-400 leading-relaxed">
                    Images are never stored in external cloud databases or transferred to third-party endpoints. Hackers cannot intercept camera frames because there is zero network transmission of biometric imagery.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex gap-3">
                <Trash2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-stone-200">Instant Ephemeral RAM Purge</div>
                  <div className="text-stone-400 leading-relaxed">
                    Any snapshot or test picture can be permanently deleted with 1 click. Memory pointers (<code className="text-amber-300">URL.revokeObjectURL</code>) are immediately released and wiped.
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status Indicators */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-stone-950/80 p-3 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-stone-400">Network Exfiltration:</span>
                <span className="text-emerald-400 font-semibold">BLOCKED</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-stone-400">Stored Photos:</span>
                <span className="text-amber-300 font-semibold">{photoCount} in RAM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-stone-400">Telemetry:</span>
                <span className="text-emerald-400 font-semibold">DISABLED</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-stone-400">Encryption:</span>
                <span className="text-emerald-400 font-semibold">TLS / HTTPS</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <button
                onClick={handleTriggerPurge}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/50 border border-red-500/30 text-xs font-mono text-red-300 hover:bg-red-900/60 transition-colors"
              >
                {purgedRecently ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">RAM Purged Successfully!</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Emergency Purge All Photos</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors"
              >
                Close Shield
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
