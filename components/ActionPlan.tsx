
import React from 'react';
import { ActionPlan } from '../types';

interface ActionPlanProps {
  plan: ActionPlan;
  onClose: () => void;
}

export const ActionPlanDisplay: React.FC<ActionPlanProps> = ({ plan, onClose }) => {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 md:p-8 animate-slideUp">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <span>✨</span> Management Action Plan
          </h3>
          <p className="text-emerald-700 font-medium">AI-generated summary of current team sentiment</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-emerald-100 rounded-full text-emerald-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Key Themes</h4>
          <div className="flex flex-wrap gap-2">
            {plan.themes.map((theme, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-emerald-100 rounded-full text-sm text-emerald-700 font-medium shadow-sm">
                #{theme}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Top 3 Actions</h4>
          <ol className="space-y-4">
            {plan.points.map((point, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {i + 1}
                </span>
                <p className="text-emerald-900 text-sm leading-relaxed font-medium pt-1">
                  {point}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
