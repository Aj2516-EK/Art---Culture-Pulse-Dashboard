
import React, { useState, useEffect, useCallback } from 'react';
import { FeedbackForm } from './components/FeedbackForm';
import { MoodChart } from './components/MoodChart';
import { CommentList } from './components/CommentList';
import { ActionPlanDisplay } from './components/ActionPlan';
import { FeedbackEntry, ActionPlan } from './types';
import { summarizeFeedback } from './services/geminiService';

const STORAGE_KEY = 'culture_pulse_data';

const App: React.FC = () => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');

  // Load initial mock data if empty
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      const mockData: FeedbackEntry[] = [
        { id: '1', mood: 4, comment: 'I love the flexible work hours!', timestamp: Date.now() - 86400000 },
        { id: '2', mood: 2, comment: 'Meetings are taking up too much time lately.', timestamp: Date.now() - 172800000 },
        { id: '3', mood: 5, comment: 'The new coffee machine is a great addition.', timestamp: Date.now() - 259200000 },
        { id: '4', mood: 3, comment: 'Communication between departments could be smoother.', timestamp: Date.now() - 345600000 },
      ];
      setEntries(mockData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const handleAddEntry = (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
    const newEntry: FeedbackEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActiveTab('dashboard');
  };

  const handleAnalyze = async () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    try {
      const plan = await summarizeFeedback(entries);
      setActionPlan(plan);
    } catch (error) {
      console.error('Failed to analyze:', error);
      alert('AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-[#F7F9F7] text-[#1F2937]">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-100">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">CulturePulse</h1>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'submit' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Give Feedback
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'submit' ? (
          <div className="animate-fadeIn">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">How's it going?</h2>
              <p className="text-gray-500">Your feedback is 100% anonymous. Be honest, help us grow.</p>
            </div>
            <FeedbackForm onSubmit={handleAddEntry} />
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
                <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Team Mood Overview
                </h3>
                <MoodChart entries={entries} />
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">Magic Summary</h3>
                  <p className="text-sm opacity-80 mt-1">Let AI analyze the vibes and suggest next steps.</p>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || entries.length === 0}
                  className="mt-8 bg-white text-emerald-700 font-bold py-3 px-4 rounded-xl shadow-md hover:bg-emerald-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.5 5.6L10 7L8.6 4.5L10 2L7.5 3.4L5 2L6.4 4.5L5 7L7.5 5.6ZM19.5 15.4L17 14L18.4 16.5L17 19L19.5 17.6L22 19L20.6 16.5L22 14L19.5 15.4ZM22 2L19.5 3.4L17 2L18.4 4.5L17 7L19.5 5.6L22 7L20.6 4.5L22 2ZM14.3 11.2L6 19.5L4.5 18L12.8 9.7L14.3 11.2ZM15.8 9.7L14.3 8.2L15.4 7.1C15.8 6.7 16.4 6.7 16.8 7.1L16.9 7.2C17.3 7.6 17.3 8.2 16.9 8.6L15.8 9.7Z" />
                      </svg>
                      Generate Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Action Plan */}
            {actionPlan && <ActionPlanDisplay plan={actionPlan} onClose={() => setActionPlan(null)} />}

            {/* Recent Comments */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
              <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Recent Anonymous Comments
              </h3>
              <CommentList entries={entries} />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-50 flex md:hidden h-16 px-4 z-20">
        <button 
          onClick={() => setActiveTab('submit')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'submit' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          <span className="text-xs font-medium">Submit</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-xs font-medium">Dashboard</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
