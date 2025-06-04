'use client';

import { motion } from 'framer-motion';

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
  return (
    <div className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.hex}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-xl p-3 transition-all flex flex-col items-center justify-center min-h-[72px] shadow-md
              ${selectedColor.hex === color.hex
                ? 'ring-2 ring-pink-500 ring-offset-2 shadow-pink-100'
                : 'hover:ring-2 hover:ring-pink-300 hover:ring-offset-2'}
            `}
            onClick={() => onColorSelect(color)}
            style={{ backgroundColor: color.hex }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 rounded-xl" />
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
    </div>
  );
} 