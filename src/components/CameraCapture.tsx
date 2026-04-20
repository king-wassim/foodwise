import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
/**
 * Props for the CameraCapture component
 */

interface CameraCaptureProps {
    /** Callback when image is captured - receives base64 encoded image */
  onCapture: (base64: string) => void;
    /** Whether analysis is currently in progress */
  isAnalyzing: boolean;
    /** Label text to display to the user */
  label: string;
}

/**
 * CameraCapture Component
 * Allows users to capture or upload images for food analysis
 * Handles file input and converts images to base64 for API processing
 *
 * @component
 * @param {CameraCaptureProps} props - Component props
 * @returns {JSX.Element} Camera input interface with upload button
 *
 * @example
 * <CameraCapture
 *   onCapture={(base64) => analyzeMeal(base64)}
 *   isAnalyzing={analyzing}
 *   label="Take a photo of your meal"
 * />
 */
export function CameraCapture({ onCapture, isAnalyzing, label }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  /**
   * Handles file selection from input
   * Converts selected image to base64 and triggers onCapture callback
   */

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        // Extract base64 data without data:image/jpeg;base64, prefix
      const base64 = (reader.result as string).split(',')[1];
      onCapture(base64);
    };
    reader.readAsDataURL(file);
    /**
     * Triggers the hidden file input when button is clicked
     * Disabled during analysis to prevent race conditions
     */
  };

  const triggerInput = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <button
        onClick={triggerInput}
        disabled={isAnalyzing}
        className={cn(
          "relative group flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-2xl border-2 border-dashed transition-all duration-300",
          isAnalyzing 
            ? "bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 cursor-not-allowed" 
            : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700/50 active:scale-95"
        )}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-stone-400 dark:text-stone-500 animate-spin" />
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Analyzing {label}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-stone-100 dark:bg-stone-900 group-hover:bg-stone-200 dark:group-hover:bg-stone-800 transition-colors">
              <Camera className="w-8 h-8 text-stone-600 dark:text-stone-300" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">Scan {label}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Take a photo or upload</p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
