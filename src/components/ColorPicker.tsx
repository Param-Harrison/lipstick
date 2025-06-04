'use client';

import { motion } from 'framer-motion';

interface Color {
  name: string;
  hex: string;
}

interface ColorPickerProps {
  selectedColor: Color;
  onColorSelect: (color: Color) => void;
}

// Add or update the color palette
const lipstickColors: Color[] = [
  { name: 'Classic Red', hex: '#C21807' },
  { name: 'Ruby Wine', hex: '#8B1E3F' },
  { name: 'Rose Pink', hex: '#E75480' },
  { name: 'Coral Crush', hex: '#FF6F61' },
  { name: 'Nude Beige', hex: '#D2A679' },
  { name: 'Soft Mauve', hex: '#B784A7' },
  { name: 'Berry Bliss', hex: '#7B294E' },
  { name: 'Deep Plum', hex: '#4B1248' },
  { name: 'Chocolate Brown', hex: '#5B3A29' },
  { name: 'Peachy Nude', hex: '#F7C6A3' },
  { name: 'Dusty Rose', hex: '#C08081' },
  { name: 'Fuchsia Pop', hex: '#D72660' },
  { name: 'Burnt Sienna', hex: '#E97451' },
  { name: 'Mulberry', hex: '#70193D' },
  { name: 'Classic Pink', hex: '#F48FB1' },
  // More nude shades
  { name: 'Soft Sand', hex: '#E2B8A3' },
  { name: 'Bare Blush', hex: '#E8C3B9' },
  { name: 'Caramel Nude', hex: '#B4846C' },
  { name: 'Toasted Almond', hex: '#CBA18B' },
  { name: 'Warm Taupe', hex: '#BFA6A0' },
  { name: 'Honey Nude', hex: '#D1A074' },
  { name: 'Pink Nude', hex: '#EEC1BB' },
  { name: 'Mocha Nude', hex: '#A9746E' },
  { name: 'Latte Nude', hex: '#C7A17A' },
];

export default function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {lipstickColors.map((color) => (
        <motion.button
          key={color.hex}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative rounded-lg p-4 transition-all flex flex-col items-center justify-center min-h-[64px] min-w-[64px] shadow-md
            ${selectedColor.hex === color.hex
              ? 'ring-2 ring-pink-500 ring-offset-2'
              : 'hover:ring-2 hover:ring-pink-300 hover:ring-offset-2'}
          `}
          onClick={() => onColorSelect(color)}
          style={{ backgroundColor: color.hex }}
        >
          <div className="absolute inset-0 bg-black/10 rounded-lg" />
          <span className="relative text-white font-medium drop-shadow-lg text-base px-2 py-1 mt-2 mb-1 text-center flex flex-col items-center justify-center leading-tight min-h-[2.5em]">
            {color.name.split(' ').slice(0, 2).join(' ')}<br />
            {color.name.split(' ').slice(2).join(' ')}
          </span>
        </motion.button>
      ))}
    </div>
  );
} 