'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
    <div
      {...getRootProps()}
      className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-pink-500 bg-pink-50/50' 
          : 'border-gray-200 hover:border-pink-400 hover:bg-gray-50/50'
        }`}
    >
      <input {...getInputProps()} />
      <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-pink-600 font-medium">Drop your photo here...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-600">Drag and drop your photo here</p>
          <p className="text-sm text-gray-500">or click to select from your files</p>
          <p className="text-xs text-gray-400 mt-2">Supports PNG, JPG, JPEG, WEBP</p>
        </div>
      )}
    </div>
  );
} 