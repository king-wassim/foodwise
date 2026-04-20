import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Trash2, 
  Utensils, 
  Filter, 
  X,
  CheckCircle2
} from 'lucide-react';
import { HistoryItem } from '../types';
import { cn } from '../lib/utils';
/**
 * Props for the HistoryView component
 */

interface HistoryViewProps {
    /** Array of previous food analyses */
  history: HistoryItem[];
    /** Callback when user selects a history item to view */
  onSelectItem: (item: HistoryItem) => void;
    /** Callback when user deletes a history item */
  onDeleteItem: (id: string) => void;
}

/**
 * HistoryView Component
 * Displays past food analyses with filtering by date and dietary preferences
 * Allows users to revisit previous analyses and manage their history
 *
 * @component
 * @param {HistoryViewProps} props - Component props
 * @returns {JSX.Element} History list with filtering capabilities
 *
 * @example
 * <HistoryView
 *   history={analysisHistory}
 *   onSelectItem={(item) => viewAnalysis(item)}
 *   onDeleteItem={(id) => removeFromHistory(id)}
 * />
 */
export function HistoryView({ history, onSelectItem, onDeleteItem }: HistoryViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    glutenFree: false,
    vegan: false,
    diabeticSafe: false,
  });
  /**
   * Filters history based on date range and dietary suitability
   */

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const itemDate = new Date(item.timestamp);
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      if (start && itemDate < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (itemDate > endOfDay) return false;
      }

      if (filters.glutenFree && !item.allergens.suitability.glutenFree) return false;
      if (filters.vegan && !item.allergens.suitability.vegan) return false;
      if (filters.diabeticSafe && !item.allergens.suitability.diabeticSafe) return false;

      return true;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [history, filters]);

  const activeFilterCount = Object.values(filters).filter(v => v !== '' && v !== false).length;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-6 rounded-full bg-stone-100 dark:bg-stone-800">
          <History className="w-12 h-12 text-stone-300 dark:text-stone-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">No history yet</h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-xs">Your past food scans and logs will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Past Analyses</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
            showFilters || activeFilterCount > 0
              ? "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900"
              : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700"
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 dark:bg-black/20 text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">Refine History</h3>
                <button 
                  onClick={() => setFilters({ startDate: '', endDate: '', glutenFree: false, vegan: false, diabeticSafe: false })}
                  className="text-xs font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">From</label>
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">To</label>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-700"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Dietary Suitability</label>
                <div className="flex flex-wrap gap-2">
                  <FilterChip 
                    label="Gluten-Free" 
                    active={filters.glutenFree} 
                    onClick={() => setFilters(f => ({ ...f, glutenFree: !f.glutenFree }))} 
                  />
                  <FilterChip 
                    label="Vegan" 
                    active={filters.vegan} 
                    onClick={() => setFilters(f => ({ ...f, vegan: !f.vegan }))} 
                  />
                  <FilterChip 
                    label="Diabetic-Safe" 
                    active={filters.diabeticSafe} 
                    onClick={() => setFilters(f => ({ ...f, diabeticSafe: !f.diabeticSafe }))} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 pb-24">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-stone-500 dark:text-stone-400">No results match your filters.</p>
            <button 
              onClick={() => setFilters({ startDate: '', endDate: '', glutenFree: false, vegan: false, diabeticSafe: false })}
              className="text-sm font-bold text-stone-800 dark:text-stone-100 underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex items-center p-4 gap-4">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-300">
                  <Utensils className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectItem(item)}>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 truncate">{item.itemName}</h4>
                  <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500">
                    <CalendarIcon className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="p-2 rounded-lg text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onSelectItem(item)}
                    className="p-2 rounded-lg text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
        active 
          ? "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900" 
          : "bg-stone-50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
      )}
    >
      {active && <CheckCircle2 className="w-3.5 h-3.5" />}
      {label}
      {active && <X className="w-3.5 h-3.5 ml-1 opacity-60" />}
    </button>
  );
}
