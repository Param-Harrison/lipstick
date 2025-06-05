'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ImageUploader from '@/components/ImageUploader';
import ColorPicker from '@/components/ColorPicker';
import LipstickPreview from '@/components/LipstickPreview';

const lipstickColors = [
  // Core classic and timeless shades
  { name: 'Classic Red', hex: '#C41E3A' }, // Vibrant, universally flattering red[](https://www.glamour.com/story/most-popular-lipstick-colors-review)[](https://www.simplynam.com/blogs/simplynam/lipstick-colour-trends-guide-7-types-of-lipstick-shades-every-girl-needs)
  { name: 'Nude Pink', hex: '#FFB6C1' }, // Soft, subtle pink-nude[](https://www.southernliving.com/classic-lipstick-shades-8678202)
  { name: 'Deep Plum', hex: '#8E4585' }, // Rich, vampy purple[](https://www.purewow.com/beauty/top-lipstick-color-trend)
  { name: 'Coral', hex: '#FF7F50' }, // Bright, summery orange-pink[](https://www.southernliving.com/classic-lipstick-shades-8678202)
  { name: 'Berry', hex: '#8B0000' }, // Deep, wine-like red[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Rose Gold', hex: '#B76E79' }, // Metallic, trendy pink[](https://www.purewow.com/beauty/top-lipstick-color-trend)
  { name: 'Mauve', hex: '#E0B0FF' }, // Soft, lilac-toned purple[](https://www.purewow.com/beauty/top-lipstick-color-trend)[](https://reads.alibaba.com/4-must-know-lip-color-trends/)
  { name: 'Burgundy', hex: '#800020' }, // Deep, elegant red[](https://www.purewow.com/beauty/top-lipstick-color-trend)
  { name: 'Peach', hex: '#FFDAB9' }, // Warm, light coral[](https://reads.alibaba.com/6-trending-lipstick-shades-women-will-love/)[](https://www.simplynam.com/blogs/simplynam/lipstick-colour-trends-guide-7-types-of-lipstick-shades-every-girl-needs)
  { name: 'Fuchsia', hex: '#FF00FF' }, // Vivid, hot pink[](https://www.purewow.com/beauty/top-lipstick-color-trend)

  // Additional trending shades for 2023-2025
  { name: 'Rosy Brown', hex: '#BC8F8F' }, // Cool-toned brown-pink, versatile[](https://www.today.com/shop/best-lipsticks-t224047)
  { name: 'Black Honey', hex: '#4A2C2A' }, // Sheer, raisin-tinted plum[](https://www.glamour.com/story/most-popular-lipstick-colors-review)[](https://www.allure.com/story/best-of-beauty-lips-winners-2023)[](https://www.allure.com/gallery/best-lipstick-for-mature-skin)
  { name: 'Dusty Pink', hex: '#DCAE96' }, // Subtle, elegant pink for daily wear[](https://reads.alibaba.com/4-must-know-lip-color-trends/)
  { name: 'Mocha', hex: '#8A624A' }, // Rich, warm brown[](https://reads.alibaba.com/4-must-know-lip-color-trends/)
  { name: 'Warm Brown', hex: '#6F4E37' }, // Earthy, '90s-inspired brown[](https://www.thecut.com/article/lipstick-colors.html)[](https://www.stylecraze.com/articles/must-have-lipstick-shades/)
  { name: 'Brick Red', hex: '#8C2F1B' }, // Rust-toned red, autumnal vibe[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Baby Pink', hex: '#F4C2C2' }, // Cool-toned, Y2K-inspired pink[](https://stylecaster.com/lists/lip-trends-2025/)
  { name: 'Metallic Mauve', hex: '#A47C9B' }, // Shimmery, ethereal mauve[](https://www.styleatacertainage.com/beauty/autumn-glam-6-lip-trends-for-fall-2023-makeup-for-women-over-40-lipstick-trends-how-to/)
  { name: 'Nostalgic Pink', hex: '#FF9999' }, // Floral, botanical-inspired pink[](https://reads.alibaba.com/6-trending-lipstick-shades-women-will-love/)
  { name: 'Fiery Peach', hex: '#FF9966' }, // Spicy, vibrant peach[](https://reads.alibaba.com/6-trending-lipstick-shades-women-will-love/)
  { name: 'Chocolate Raspberry', hex: '#5C4033' }, // Nostalgic brown-red[](https://www.thecut.com/article/lipstick-colors.html)
  { name: 'Pearly White', hex: '#F5F6F5' }, // Iridescent, Y2K-inspired shimmer[](https://stylecaster.com/lists/lip-trends-2025/)
  { name: 'Frosty Lilac', hex: '#D8BFD8' }, // Cool, multidimensional frosty shade[](https://reads.alibaba.com/6-trending-lipstick-shades-women-will-love/)
  { name: 'True Cherry Red', hex: '#D2122E' }, // Bright, classic cherry red[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Plum Red', hex: '#6B1C2D' }, // Deep, plummy red[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Orange Red', hex: '#E34234' }, // Warm, orange-based red[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Savvy Sienna', hex: '#A0522D' }, // Warm, '90s-inspired sienna[](https://www.styleatacertainage.com/beauty/autumn-glam-6-lip-trends-for-fall-2023-makeup-for-women-over-40-lipstick-trends-how-to/)
  { name: 'Deep Violet', hex: '#4B0082' }, // Bold, unconventional purple[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
  { name: 'Black', hex: '#000000' }, // Dramatic, subculture-inspired[](https://www.harpersbazaar.com/beauty/makeup/a44040126/weird-girl-colorful-lipstick-trend/)
  { name: 'Blue', hex: '#0000FF' }, // Experimental, avant-garde shade[](https://www.harpersbazaar.com/beauty/makeup/a44040126/weird-girl-colorful-lipstick-trend/)[](https://www.cosmexshow.com/en-gb/blog/hottest-lip-color-trends-2023-2024.html)
  { name: 'Gray', hex: '#808080' }, // Unconventional, modern chic[](https://www.harpersbazaar.com/beauty/makeup/a44040126/weird-girl-colorful-lipstick-trend/)
  { name: 'Yellow', hex: '#FFFF00' }, // Bold, creative accent[](https://www.harpersbazaar.com/beauty/makeup/a44040126/weird-girl-colorful-lipstick-trend/)
  { name: 'Green', hex: '#008000' } // Vibrant, experimental shade[](https://www.lorealparisusa.com/beauty-magazine/makeup/lip-makeup/best-lipstick-colors-finishes-trends-consumer-survey)
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(lipstickColors[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Virtual Lipstick Try-On
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Upload your photo and try different lipstick shades instantly. Perfect for influencers and beauty enthusiasts!
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <PhotoIcon className="w-6 h-6 text-pink-500" />
              Upload Your Photo
            </h2>
            <ImageUploader onImageSelect={setSelectedImage} />
          </motion.div>

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <SparklesIcon className="w-6 h-6 text-pink-500" />
                Choose Your Shade
              </h2>
              <ColorPicker
                colors={lipstickColors}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
            </motion.div>
          )}

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <LipstickPreview
                image={selectedImage}
                color={selectedColor}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
