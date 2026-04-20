import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, XCircle, Info, Flame, Zap, Droplets, Scale } from 'lucide-react';
import { FoodAnalysisResult } from '../types';
import { cn } from '../lib/utils';
/**
 * Props for the AnalysisDisplay component
 */

interface AnalysisDisplayProps {
    /** The analysis results to display */
  result: FoodAnalysisResult;
}

/**
 * AnalysisDisplay Component
 * Renders detailed food analysis results with nutrition breakdown and allergen info
 * Shows nutritional macros in card format and dietary compatibility flags
 *
 * @component
 * @param {AnalysisDisplayProps} props - Component props
 * @returns {JSX.Element} Formatted analysis results display
 *
 * @example
 * <AnalysisDisplay result={analysisResult} />
 */
export function AnalysisDisplay({ result }: AnalysisDisplayProps) {
  const { itemName, portionEstimate, nutrition, allergens, summary } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl bg-white dark:bg-stone-800 rounded-3xl shadow-xl overflow-hidden border border-stone-100 dark:border-stone-700"
    >
      {/* Header */}
      <div className="p-6 bg-stone-50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-700">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{itemName}</h2>
        <p className="text-stone-500 dark:text-stone-400 italic">{portionEstimate}</p>
      </div>

      {/* Summary */}
      <div className="p-6 border-b border-stone-100 dark:border-stone-700">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-stone-400 mt-1 flex-shrink-0" />
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Nutrition Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <NutritionCard icon={<Flame className="w-4 h-4" />} label="Calories" value={nutrition.calories} unit="kcal" color="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" />
        <NutritionCard icon={<Zap className="w-4 h-4" />} label="Protein" value={nutrition.protein} unit="g" color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <NutritionCard icon={<Droplets className="w-4 h-4" />} label="Carbs" value={nutrition.carbs} unit="g" color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" />
        <NutritionCard icon={<Scale className="w-4 h-4" />} label="Fat" value={nutrition.fat} unit="g" color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
      </div>

      {/* Allergens & Suitability */}
      <div className="p-6 bg-stone-50/50 dark:bg-stone-900/30 space-y-6">
        {/* Allergens */}
        <div>
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">Allergen Detection</h3>
          {allergens.detected.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allergens.detected.map((allergen) => (
                <span key={allergen} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {allergen}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              No common allergens detected
            </div>
          )}
        </div>

        {/* Suitability */}
        <div>
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">Dietary Suitability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SuitabilityItem label="Gluten-Free" isSafe={allergens.suitability.glutenFree} />
            <SuitabilityItem label="Vegan" isSafe={allergens.suitability.vegan} />
            <SuitabilityItem label="Diabetic-Safe" isSafe={allergens.suitability.diabeticSafe} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NutritionCard({ icon, label, value, unit, color }: { icon: React.ReactNode, label: string, value: number, unit: string, color: string }) {
  return (
    <div className={cn("p-4 rounded-2xl flex flex-col gap-1", color)}>
      <div className="flex items-center gap-2 opacity-80">
        {icon}
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-xs opacity-70">{unit}</span>
      </div>
    </div>
  );
}

function SuitabilityItem({ label, isSafe }: { label: string, isSafe: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-3 rounded-xl border",
      isSafe 
        ? "bg-white dark:bg-stone-800 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-400" 
        : "bg-white dark:bg-stone-800 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400"
    )}>
      <span className="text-sm font-medium">{label}</span>
      {isSafe ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  );
}
