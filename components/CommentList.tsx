
import React from 'react';
import { FeedbackEntry } from '../types';

interface CommentListProps {
  entries: FeedbackEntry[];
}

const MOOD_EMOJIS: Record<number, string> = {
  1: '😫', 2: '😕', 3: '😐', 4: '😊', 5: '🤩'
};

export const CommentList: React.FC<CommentListProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No comments yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-50">
            {MOOD_EMOJIS[entry.mood]}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Anonymous Member</span>
              <span className="text-xs text-gray-400">
                {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {entry.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
