import React from 'react';
import { Youtube, Award, Sparkles, BookOpen, Check } from 'lucide-react';
import { GLOBAL_MUA_INSIGHTS } from '../data/presets';

export const GlobalMuaMasterclass: React.FC = () => {
  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">
            GLOBAL MUA CURRICULUM · YOUTUBE & RUNWAY REPOSITORIES
          </div>
          <h2 className="text-xl font-display font-medium text-stone-100 mt-0.5">
            Trained on Global Masterclasses
          </h2>
        </div>
        <div className="text-xs text-stone-400">
          Synthesizing Indian, Korean, French, and American master artists
        </div>
      </div>

      {/* 4 Regional Masterclass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GLOBAL_MUA_INSIGHTS.map((insight) => (
          <div
            key={insight.region}
            className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col justify-between hover:border-stone-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-300 font-mono">
                  {insight.region}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Public Video Corpus</span>
              </div>

              <div className="text-xs font-medium text-stone-300 mb-1">
                Artists: <strong className="text-stone-100">{insight.artists}</strong>
              </div>

              <div className="text-xs font-semibold text-rose-300 mb-2">
                Key Technique: {insight.keyTechnique}
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-3">
                {insight.rule}
              </p>
            </div>

            <div className="pt-2.5 border-t border-stone-800/80 bg-stone-900/60 -mx-4 -mb-4 p-3 rounded-b-xl">
              <div className="text-[11px] text-amber-200 font-medium flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Pro Anti-Cakeyness Tip:</strong> {insight.avoidCakeyness}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
