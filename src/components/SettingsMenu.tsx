import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, X, Settings, User, Bell, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
/**
 * Props for the SettingsMenu component
 */

interface SettingsMenuProps {
    /** Whether the settings menu is currently open */
  isOpen: boolean;
    /** Callback to close the settings menu */
  onClose: () => void;
    /** Current dark mode state */
  isDarkMode: boolean;
    /** Callback to toggle dark mode */
  toggleDarkMode: () => void;
}

/**
 * SettingsMenu Component
 * Slide-out settings panel with theme toggle and other user preferences
 * Includes dark/light mode toggle with smooth animations
 *
 * @component
 * @param {SettingsMenuProps} props - Component props
 * @returns {JSX.Element} Animated settings slide panel
 *
 * @example
 * <SettingsMenu
 *   isOpen={settingsOpen}
 *   onClose={() => setSettingsOpen(false)}
 *   isDarkMode={darkMode}
 *   toggleDarkMode={() => setDarkMode(!darkMode)}
 * />
 */
export function SettingsMenu({ isOpen, onClose, isDarkMode, toggleDarkMode }: SettingsMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-stone-900 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Settings</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Appearance</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <Moon className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-orange-400" />
                      )}
                      <span className="font-medium text-stone-700 dark:text-stone-200">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-300",
                        isDarkMode ? "bg-stone-600" : "bg-stone-300"
                      )}
                    >
                      <motion.div
                        animate={{ x: isDarkMode ? 26 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </div>

                {/* Other Settings (Placeholders) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Account</h3>
                  <div className="space-y-2">
                    <SettingsItem icon={<User className="w-5 h-5" />} label="Profile" />
                    <SettingsItem icon={<Bell className="w-5 h-5" />} label="Notifications" />
                    <SettingsItem icon={<Shield className="w-5 h-5" />} label="Privacy" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs text-center text-stone-400">
                  FoodWise v1.0.0 <br />
                  Made with AI
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
          {icon}
        </div>
        <span className="font-medium text-stone-700 dark:text-stone-200">{label}</span>
      </div>
      <div className="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700" />
    </button>
  );
}
