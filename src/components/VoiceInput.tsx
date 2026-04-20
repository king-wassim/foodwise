import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
/**
 * Props for the VoiceInput component
 */

interface VoiceInputProps {
    /** Callback when voice recording is completed and transcribed */
  onVoiceLog: (text: string) => void;
    /** Whether analysis is currently in progress */
  isAnalyzing: boolean;
}

/**
 * VoiceInput Component
 * Captures food descriptions via voice using Web Speech API
 * Transcribes audio to text and passes to analysis handler
 *
 * @component
 * @param {VoiceInputProps} props - Component props
 * @returns {JSX.Element} Voice recording interface
 *
 * Note: Requires HTTPS in production. Speech Recognition may not be available in all browsers.
 *
 * @example
 * <VoiceInput
 *   onVoiceLog={(text) => analyzeVoice(text)}
 *   isAnalyzing={analyzing}
 * />
 */
export function VoiceInput({ onVoiceLog, isAnalyzing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  /**
   * Starts voice recording using Web Speech API
   * Handles browser compatibility (webkit prefix for some browsers)
   */

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
      // Configure recognition settings
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };
      // Trigger analysis when recording ends
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (transcript) {
        onVoiceLog(transcript);
      }
    };

    recognitionRef.current.start();
    /**
     * Stops the current voice recording session
     */
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isAnalyzing}
        className={cn(
          "relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-lg",
          isRecording 
            ? "bg-red-500 animate-pulse" 
            : isAnalyzing 
              ? "bg-stone-200 dark:bg-stone-800 cursor-not-allowed" 
              : "bg-stone-800 dark:bg-stone-100 hover:bg-stone-900 dark:hover:bg-stone-200 active:scale-95"
        )}
      >
        {isAnalyzing ? (
          <Loader2 className="w-8 h-8 text-stone-400 dark:text-stone-600 animate-spin" />
        ) : isRecording ? (
          <Square className="w-8 h-8 text-white fill-white" />
        ) : (
          <Mic className={cn("w-8 h-8", isRecording ? "text-white" : "text-white dark:text-stone-900")} />
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
          {isRecording ? "Listening..." : isAnalyzing ? "Analyzing voice log..." : "Tap to log meal by voice"}
        </p>
        {transcript && (
          <p className="mt-2 text-xs italic text-stone-400 dark:text-stone-500 max-w-xs line-clamp-2">
            "{transcript}"
          </p>
        )}
      </div>
    </div>
  );
}
