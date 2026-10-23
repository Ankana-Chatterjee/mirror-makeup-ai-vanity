import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Camera, Sparkles, RefreshCw, Eye, ShieldCheck } from 'lucide-react';
import { LookMoodId } from '../types/glowguide';

interface FinishCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLook: LookMoodId;
  currentPhotoBase64?: string | null;
}

export const FinishCheckModal: React.FC<FinishCheckModalProps> = ({
  isOpen,
  onClose,
  selectedLook,
  currentPhotoBase64,
}) => {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const checklistItems = [
    { text: 'Skin prep fully settled; no pilling or slip', tip: 'If pilling occurs, lightly sweep a clean dry cotton pad to lift pills.' },
    { text: 'Foundation seamlessly blended down jawline onto neck', tip: 'Check under daylight window to avoid two-tone flash.' },
    { text: 'Corrector placed strictly on discoloured zones, not cheeks', tip: 'Peach or orange should not bleed into natural healthy skin.' },
    { text: 'Under-eye concealer tapped smooth without fine-line creasing', tip: 'If creasing, tap with warm ring finger before setting.' },
    { text: 'Eyeliner wings and lash lines balanced looking straight ahead', tip: 'Look directly at mirror with relaxed brows to judge wing height.' },
    { text: 'Blush, bronzer and contour edges softly diffused upward', tip: 'Use a clean fluffy kabuki brush in light circular motions.' },
    { text: 'Nose corners, chin crease, and smile lines inspected for pooling', tip: 'Blot smile lines with a single ply tissue.' },
    { text: 'Natural light inspection completed; powder applied only to shine', tip: 'Keep cheeks and high points luminous; powder T-zone.' },
  ];

  const handleToggle = (index: number) => {
    setChecklist((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const handleRunAIAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/audit-makeup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentPhotoBase64 || '',
          selectedLook,
          checklistState: checklist
        })
      });
      const data = await response.json();
      if (data.success && data.audit) {
        setAuditResult(data.audit);
      }
    } catch (e) {
      console.error('Audit failed:', e);
    } finally {
      setIsAuditing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white border border-[#eadde1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Finish Makeup Inspection Checklist"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#eadde1] flex items-center justify-between bg-[#fffaf7]">
          <div>
            <h3 className="font-bold text-base text-[#29202a] flex items-center gap-2">
              <span>Finish Check & Symmetry Inspection</span>
              <span className="text-xs font-normal text-[#c45b78] bg-[#f8e7ec] px-2 py-0.5 rounded-full">
                {completedCount}/8 Checked
              </span>
            </h3>
            <p className="text-xs text-[#766b77] mt-0.5">
              Verify your {selectedLook} finish before heading out into daylight.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#766b77] hover:bg-[#f8e7ec] hover:text-[#c45b78] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Progress bar */}
          <div className="w-full bg-[#f4ebeb] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#c45b78] h-full transition-all duration-300"
              style={{ width: `${(completedCount / 8) * 100}%` }}
            />
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-2.5">
            {checklistItems.map((item, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                  checklist[idx]
                    ? 'bg-[#fff5f7] border-[#f0c3cf]'
                    : 'bg-[#fffdfc] border-[#eadde1] hover:border-[#d9bcc5]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklist[idx]}
                  onChange={() => handleToggle(idx)}
                  className="mt-0.5 h-4 w-4 rounded-sm text-[#c45b78] focus:ring-[#c45b78] border-[#eadde1] cursor-pointer"
                />
                <div className="text-xs">
                  <span className={`font-semibold ${checklist[idx] ? 'text-[#c45b78] line-through' : 'text-[#29202a]'}`}>
                    {item.text}
                  </span>
                  <p className="text-[11px] text-[#766b77] mt-0.5">{item.tip}</p>
                </div>
              </label>
            ))}
          </div>

          {/* AI Makeup Audit Section */}
          <div className="p-4 rounded-xl bg-[#fffaf7] border border-[#eadde1] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c45b78]" />
                <h4 className="text-xs font-bold text-[#29202a]">Automated AI Makeup & Symmetry Audit</h4>
              </div>
              <button
                onClick={handleRunAIAudit}
                disabled={isAuditing}
                className="bg-[#c45b78] hover:bg-[#a84664] disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isAuditing ? 'Evaluating...' : 'Inspect with AI'}</span>
              </button>
            </div>

            {auditResult ? (
              <div className="space-y-2 pt-2 border-t border-[#eadde1] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#766b77]">Symmetry:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    auditResult.symmetryScore === 'Good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {auditResult.symmetryScore}
                  </span>
                  <span className="text-[#665965]">{auditResult.symmetryFeedback}</span>
                </div>
                <p><strong className="text-[#766b77]">Blending:</strong> {auditResult.blendFeedback}</p>
                <p><strong className="text-[#766b77]">Crease Check:</strong> {auditResult.creaseCheck}</p>
                <div className="p-2.5 rounded-lg bg-[#fbf3f5] border border-[#f5dde4] text-[#8b3b55]">
                  <strong>Pro MUA Fix:</strong> {auditResult.proTipFix}
                </div>
                <div className="text-[10px] text-[#766b77] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#766b77] shrink-0" />
                  <span>{auditResult.limitations}</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#766b77]">
                GlowGuide AI can inspect your uploaded photo for eyeliner wing symmetry, jawline blend lines, and under-eye creasing balance.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#eadde1] bg-white flex justify-end gap-2">
          <button
            onClick={() => setChecklist({ 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true })}
            className="text-xs text-[#766b77] hover:text-[#c45b78] px-3 py-2 rounded-lg font-medium transition"
          >
            Check All
          </button>
          <button
            onClick={onClose}
            className="bg-[#c45b78] hover:bg-[#a84664] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            Done & Ready
          </button>
        </div>
      </div>
    </div>
  );
};
