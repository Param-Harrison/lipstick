'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface Color {
  name: string;
  hex: string;
}

interface ColorPickerProps {
  colors: Color[];
  selectedColor: Color;
  onColorSelect: (color: Color) => void;
}

export default function ColorPicker({ colors, selectedColor, onColorSelect }: ColorPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close expanded view when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Color Preview */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full rounded-xl p-4 transition-all flex items-center justify-between bg-white shadow-md hover:shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg shadow-inner"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">{selectedColor.name}</h3>
            <p className="text-sm text-gray-500">Tap to change shade</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Color Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {colors.map((color) => (
                <motion.button
                  key={color.hex}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-lg p-2 transition-all flex flex-col items-center justify-center min-h-[64px]
                    ${selectedColor.hex === color.hex
                      ? 'ring-2 ring-pink-500 ring-offset-2 shadow-pink-100'
                      : 'hover:ring-2 hover:ring-pink-300 hover:ring-offset-2'}
                  `}
                  onClick={() => {
                    onColorSelect(color);
                    setIsExpanded(false);
                  }}
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 rounded-lg" />
                  <span className="relative text-white font-medium drop-shadow-lg text-sm px-2 py-1 text-center flex flex-col items-center justify-center leading-tight">
                    {color.name.split(' ').slice(0, 2).join(' ')}
                    {color.name.split(' ').length > 2 && (
                      <span className="text-xs opacity-90">
                        {color.name.split(' ').slice(2).join(' ')}
                      </span>
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 