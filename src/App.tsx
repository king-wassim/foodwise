import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  FileText, 
  Mic, 
  History, 
  Settings, 
  ChevronRight, 
  ArrowLeft,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import { CameraCapture } from './components/CameraCapture';
import { VoiceInput } from './components/VoiceInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { HistoryView } from './components/HistoryView';
import { SettingsMenu } from './components/SettingsMenu';
import { analyzeMealImage, analyzeLabelImage, analyzeVoiceLog } from './services/gemini';
import { FoodAnalysisResult, AnalysisMode, HistoryItem } from './types';
import { cn } from './lib/utils';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<AnalysisMode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToHistory = (data: FoodAnalysisResult) => {
    const newItem: HistoryItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleMealCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeMealImage(base64);
      setResult(data);
      addToHistory(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze meal. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLabelCapture = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeLabelImage(base64);
      setResult(data);
      addToHistory(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to read label. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceLog = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeVoiceLog(text);
      setResult(data);
      addToHistory(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process voice log. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setActiveMode(null);
    setResult(null);
    setError(null);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setResult(item);
    setActiveMode(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {/* Header */}
      <header className="px-6 py-8 flex items-center justify-between sticky top-0 bg-stone-50/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {activeMode || result ? (
            <button 
              onClick={reset}
              className="p-2 rounded-full hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-stone-600" />
            </button>
          ) : (
            <div className="p-2 rounded-xl bg-stone-800">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight">FoodWise</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-orange-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400" />
            )}
          </button>
          <button 
            onClick={() => setActiveMode('history')}
            className={cn(
              "p-2 rounded-full transition-colors",
              activeMode === 'history' ? "bg-stone-800 text-white" : "hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
            )}
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </button>
        </div>
      </header>

      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />

      <main className="px-6 max-w-2xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {!activeMode && !result ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Hero */}
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-stone-800 leading-tight">
                  What are you <br />
                  <span className="text-stone-400 italic font-serif">eating today?</span>
                </h2>
                <p className="text-stone-500 max-w-xs">
                  Analyze meals, scan labels, and track your nutrition with AI.
                </p>
              </div>

              {/* Action Grid */}
              <div className="grid gap-4">
                <ActionCard 
                  icon={<Camera className="w-6 h-6" />}
                  title="Meal Scan"
                  description="Identify food & estimate portions"
                  onClick={() => setActiveMode('meal')}
                  color="bg-stone-800 text-white"
                />
                <ActionCard 
                  icon={<FileText className="w-6 h-6" />}
                  title="Label Reader"
                  description="Scan ingredients for allergens"
                  onClick={() => setActiveMode('label')}
                  color="bg-white text-stone-800 border border-stone-200"
                />
                <ActionCard 
                  icon={<Mic className="w-6 h-6" />}
                  title="Voice Log"
                  description="Log your meal by speaking"
                  onClick={() => setActiveMode('voice')}
                  color="bg-white text-stone-800 border border-stone-200"
                />
              </div>

              {/* Tips Section */}
              <div className="p-6 rounded-3xl bg-stone-100 border border-stone-200 flex gap-4">
                <div className="p-3 rounded-full bg-stone-200 h-fit">
                  <Info className="w-5 h-5 text-stone-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-stone-800">Pro Tip</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Scan the ingredient label of packaged foods to get precise allergen warnings and dietary suitability.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <AnalysisDisplay result={result} />
              <button 
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="w-full py-4 rounded-2xl bg-stone-800 text-white font-bold shadow-lg hover:bg-stone-900 transition-all active:scale-95"
              >
                Scan Another Item
              </button>
            </motion.div>
          ) : activeMode === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <HistoryView 
                history={history} 
                onSelectItem={selectHistoryItem}
                onDeleteItem={deleteHistoryItem}
              />
            </motion.div>
          ) : (
            <motion.div
              key="active-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-12"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-stone-800">
                  {activeMode === 'meal' ? 'Meal Analysis' : activeMode === 'label' ? 'Label OCR' : 'Voice Logging'}
                </h3>
                <p className="text-stone-500">
                  {activeMode === 'meal' ? 'Take a clear photo of your plate' : activeMode === 'label' ? 'Scan the ingredient list clearly' : 'Describe your meal in detail'}
                </p>
              </div>

              {activeMode === 'meal' && (
                <CameraCapture 
                  label="Meal" 
                  isAnalyzing={isAnalyzing} 
                  onCapture={handleMealCapture} 
                />
              )}
              {activeMode === 'label' && (
                <CameraCapture 
                  label="Label" 
                  isAnalyzing={isAnalyzing} 
                  onCapture={handleLabelCapture} 
                />
              )}
              {activeMode === 'voice' && (
                <VoiceInput 
                  isAnalyzing={isAnalyzing} 
                  onVoiceLog={handleVoiceLog} 
                />
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav (Mobile style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-t border-stone-100 dark:border-stone-800 px-8 py-4 flex justify-around items-center z-20">
        <NavIcon icon={<UtensilsCrossed className="w-6 h-6" />} active={!activeMode && !result} onClick={reset} />
        <NavIcon 
          icon={<History className="w-6 h-6" />} 
          active={activeMode === 'history'} 
          onClick={() => setActiveMode('history')}
        />
        <NavIcon 
          icon={<Settings className="w-6 h-6" />} 
          active={isSettingsOpen} 
          onClick={() => setIsSettingsOpen(true)}
        />
      </nav>
    </div>
  );
}

function ActionCard({ icon, title, description, onClick, color }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-3xl flex items-center justify-between transition-all duration-300 group active:scale-95 shadow-sm hover:shadow-md",
        color
      )}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-stone-50/10 dark:bg-stone-800/50 group-hover:bg-stone-50/20 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-sm opacity-70">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
    </button>
  );
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all duration-300",
        active ? "text-stone-900 dark:text-stone-50 bg-stone-100 dark:bg-stone-800" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
      )}
    >
      {icon}
    </button>
  );
}

