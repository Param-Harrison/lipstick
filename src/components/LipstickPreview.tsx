'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Color {
  name: string;
  hex: string;
}

interface LipstickPreviewProps {
  image: string;
  color: Color;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

interface FaceMeshResults {
  multiFaceLandmarks: Array<Array<{
    x: number;
    y: number;
    z: number;
  }>>;
}

interface FaceMesh {
  setOptions: (options: {
    maxNumFaces: number;
    refineLandmarks: boolean;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }) => void;
  onResults: (callback: (results: FaceMeshResults) => void) => void;
  send: (data: { image: HTMLImageElement }) => void;
}

export default function LipstickPreview({
  image,
  color,
  isProcessing,
  setIsProcessing,
}: LipstickPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceMesh, setFaceMesh] = useState<FaceMesh | null>(null);

  useEffect(() => {
    const initializeFaceMesh = async () => {
      // Dynamically import MediaPipe Face Mesh
      const faceMeshModule = await import('@mediapipe/face_mesh');
      const FaceMesh = faceMeshModule.FaceMesh;

      const faceMesh = new FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results: FaceMeshResults) => {
        if (canvasRef.current && results.multiFaceLandmarks) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the original image
          const img = new Image();
          img.src = image;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw face mesh landmarks
            for (const landmarks of results.multiFaceLandmarks) {
              // MediaPipe Face Mesh indices for lips
              const outerLipIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];
              const innerLipIndices = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];

              const outerLip = outerLipIndices.map(i => landmarks[i]);
              const innerLip = innerLipIndices.map(i => landmarks[i]);

              // Create a mask for the lips
              ctx.save();
              ctx.beginPath();
              outerLip.forEach((landmark, index) => {
                if (index === 0) {
                  ctx.moveTo(landmark.x * canvas.width, landmark.y * canvas.height);
                } else {
                  ctx.lineTo(landmark.x * canvas.width, landmark.y * canvas.height);
                }
              });
              ctx.closePath();
              ctx.moveTo(innerLip[0].x * canvas.width, innerLip[0].y * canvas.height);
              innerLip.forEach((landmark, index) => {
                if (index !== 0) {
                  ctx.lineTo(landmark.x * canvas.width, landmark.y * canvas.height);
                }
              });
              ctx.closePath();
              ctx.clip('evenodd');

              // Blend lipstick color using soft-light for realism
              ctx.globalCompositeOperation = 'soft-light';
              // Create a vertical gradient for the lipstick
              const minY = Math.min(...outerLip.map(pt => pt.y * canvas.height));
              const maxY = Math.max(...outerLip.map(pt => pt.y * canvas.height));
              const gradient = ctx.createLinearGradient(0, minY, 0, maxY);
              gradient.addColorStop(0, color.hex);
              gradient.addColorStop(1, adjustColor(color.hex, -30));
              ctx.fillStyle = gradient;
              ctx.fillRect(0, minY, canvas.width, maxY - minY);

              // Restore to normal composite mode
              ctx.globalCompositeOperation = 'source-over';

              // Add a subtle highlight for gloss (optional, for realism)
              ctx.save();
              ctx.globalAlpha = 0.18;
              ctx.beginPath();
              // Place highlight on the lower lip center
              const highlight = outerLip[10];
              ctx.ellipse(
                highlight.x * canvas.width,
                highlight.y * canvas.height,
                canvas.width * 0.06,
                canvas.height * 0.018,
                0,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = '#fff';
              ctx.fill();
              ctx.restore();

              ctx.restore();
            }
          };
        }
      });

      setFaceMesh(faceMesh);
    };

    initializeFaceMesh();
  }, [image, color]);

  useEffect(() => {
    if (faceMesh && image) {
      setIsProcessing(true);
      const img = new Image();
      img.src = image;
      img.onload = () => {
        faceMesh.send({ image: img });
        setIsProcessing(false);
      };
    }
  }, [faceMesh, image, color, setIsProcessing]);

  return (
    <div className="relative flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-xl overflow-hidden shadow-2xl w-full max-w-[350px] mx-auto"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-w-[350px] mx-auto block"
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-lg font-medium">Processing...</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  
  const newR = Math.min(255, Math.max(0, r));
  const newG = Math.min(255, Math.max(0, g));
  const newB = Math.min(255, Math.max(0, b));
  
  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
} 