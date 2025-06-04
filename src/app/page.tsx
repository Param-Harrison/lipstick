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
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-6">
            Virtual Lipstick Try-On
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload your photo and try different lipstick shades instantly. Perfect for influencers and beauty enthusiasts!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
              <PhotoIcon className="w-7 h-7 text-pink-500" />
              Upload Your Photo
            </h2>
            <div className="flex-1">
              <ImageUploader onImageSelect={setSelectedImage} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
              <SparklesIcon className="w-7 h-7 text-pink-500" />
              Choose Your Shade
            </h2>
            <div className="flex-1">
              <ColorPicker
                colors={lipstickColors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </div>
          </motion.div>
        </div>

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full flex justify-center"
          >
            <div className="w-full max-w-4xl">
              <LipstickPreview
                image={selectedImage}
                color={selectedColor}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
