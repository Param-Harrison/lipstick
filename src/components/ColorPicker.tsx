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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {colors.map((color) => (
        <motion.button
          key={color.hex}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative rounded-lg p-4 transition-all ${
            selectedColor.hex === color.hex
              ? 'ring-2 ring-pink-500 ring-offset-2'
              : 'hover:ring-2 hover:ring-pink-300 hover:ring-offset-2'
          }`}
          onClick={() => onColorSelect(color)}
          style={{ backgroundColor: color.hex }}
        >
          <div className="absolute inset-0 bg-black/10 rounded-lg" />
          <span className="relative text-white font-medium drop-shadow-lg">
            {color.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
} 