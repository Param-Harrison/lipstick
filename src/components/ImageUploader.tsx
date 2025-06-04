'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onImageSelect(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-pink-600 font-medium">Drop your photo here...</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">Drag and drop your photo here, or click to select</p>
          <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG, WEBP</p>
        </div>
      )}
    </motion.div>
  );
} 