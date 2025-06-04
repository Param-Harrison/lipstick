'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ImageUploader from '@/components/ImageUploader';
import ColorPicker from '@/components/ColorPicker';
import LipstickPreview from '@/components/LipstickPreview';

const lipstickColors = [
  { name: 'Classic Red', hex: '#C41E3A' },
  { name: 'Nude Pink', hex: '#FFB6C1' },
  { name: 'Deep Plum', hex: '#8E4585' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Berry', hex: '#8B0000' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Mauve', hex: '#E0B0FF' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Fuchsia', hex: '#FF00FF' },
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(lipstickColors[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="flex-1 w-full max-w-[400px] mx-auto px-4 py-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-4">
          Virtual Lipstick Try-On
        </h1>
        <p className="text-lg text-gray-600 max-w-xs mx-auto">
          Upload your photo and try different lipstick shades instantly. Perfect for influencers and beauty enthusiasts!
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <PhotoIcon className="w-6 h-6 text-pink-500" />
            Upload Your Photo
          </h2>
          <ImageUploader onImageSelect={setSelectedImage} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <SparklesIcon className="w-6 h-6 text-pink-500" />
            Choose Your Shade
          </h2>
          <ColorPicker
            colors={lipstickColors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </motion.div>
      </div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full flex justify-center"
        >
          <LipstickPreview
            image={selectedImage}
            color={selectedColor}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </motion.div>
      )}
    </main>
  );
}
