
import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (entry: { mood: number; comment: string }) => void;
}

const MOODS = [
  { value: 1, icon: '😫', label: 'Awful', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { value: 2, icon: '😕', label: 'Bad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 3, icon: '😐', label: 'Okay', color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
  { value: 4, icon: '😊', label: 'Good', color: 'bg-emerald-500 text-white border-emerald-600' },
  { value: 5, icon: '🤩', label: 'Amazing', color: 'bg-emerald-600 text-white border-emerald-700' },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood && comment.trim()) {
      onSubmit({ mood, comment });
      setMood(null);
      setComment('');
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-6 text-center">
            How are you feeling about work today?
          </label>
          <div className="flex justify-between gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  mood === m.value 
                    ? `${m.color} border-current ring-4 ring-emerald-50 shadow-inner` 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                }`}
              >
                <span className="text-3xl md:text-4xl mb-2">{m.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">
            Tell us more...
          </label>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts, suggestions, or concerns anonymously..."
            className="w-full h-40 p-5 bg-gray-50 border border-emerald-50 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all outline-none resize-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={!mood || !comment.trim()}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Anonymous Feedback
        </button>
      </form>
    </div>
  );
};
