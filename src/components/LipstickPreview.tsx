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

            // Debug mode: set to true to draw mask outlines
            const debug = false;

            // Draw face mesh landmarks
            for (const landmarks of results.multiFaceLandmarks) {
              // MediaPipe Face Mesh indices for lips
              const outerLipIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311, 312, 13, 82, 81, 42, 183, 78];
              // Full, closed inner lip contour (better fit for mouth opening)
              const innerLipIndices = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78];

              const outerLip = outerLipIndices.map(i => landmarks[i]);
              const innerLip = innerLipIndices.map(i => landmarks[i]);

              // Debug: draw outer and inner lip contours
              if (debug) {
                ctx.save();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(0,255,0,0.7)'; // Green for outer
                ctx.beginPath();
                outerLip.forEach((landmark, index) => {
                  if (index === 0) {
                    ctx.moveTo(landmark.x * canvas.width, landmark.y * canvas.height);
                  } else {
                    ctx.lineTo(landmark.x * canvas.width, landmark.y * canvas.height);
                  }
                });
                ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = 'rgba(255,0,0,0.7)'; // Red for inner
                ctx.beginPath();
                innerLip.forEach((landmark, index) => {
                  if (index === 0) {
                    ctx.moveTo(landmark.x * canvas.width, landmark.y * canvas.height);
                  } else {
                    ctx.lineTo(landmark.x * canvas.width, landmark.y * canvas.height);
                  }
                });
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
              }

              // Create a mask for the lips (outer - inner, inner in reverse for evenodd)
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
              for (let i = innerLip.length - 1; i >= 0; i--) {
                const landmark = innerLip[i];
                if (i === innerLip.length - 1) {
                  ctx.moveTo(landmark.x * canvas.width, landmark.y * canvas.height);
                } else {
                  ctx.lineTo(landmark.x * canvas.width, landmark.y * canvas.height);
                }
              }
              ctx.closePath();
              ctx.clip('evenodd');

              // Blend lipstick color using soft-light for realism
              ctx.globalCompositeOperation = 'soft-light';
              const minY = Math.min(...outerLip.map(pt => pt.y * canvas.height));
              const maxY = Math.max(...outerLip.map(pt => pt.y * canvas.height));
              const gradient = ctx.createLinearGradient(0, minY, 0, maxY);
              gradient.addColorStop(0, color.hex);
              gradient.addColorStop(1, adjustColor(color.hex, -30));
              ctx.fillStyle = gradient;
              ctx.fillRect(0, minY, canvas.width, maxY - minY);
              ctx.globalCompositeOperation = 'source-over';


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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-[500px] mx-auto bg-white"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
        />
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-white text-lg font-medium">Processing your photo...</div>
              <p className="text-white/80 text-sm">Applying lipstick color: {color.name}</p>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-white font-medium">{color.name}</span>
            </div>
            <div className="text-white/80 text-sm">
              Try another shade above
            </div>
          </div>
        </motion.div>
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