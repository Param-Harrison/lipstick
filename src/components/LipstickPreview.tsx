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

              // Only draw gloss if lips are closed (gap between upper/lower inner lip is small)
              // Use points 13 (upper inner) and 14 (lower inner) for vertical gap
              // const upperInner = landmarks[13];
              // const lowerInner = landmarks[14];
              // const lipGap = Math.abs((upperInner.y - lowerInner.y) * canvas.height);
              // if (lipGap < canvas.height * 0.04) { // threshold: adjust as needed
              //   ctx.save();
              //   ctx.globalAlpha = 0.18;
              //   ctx.beginPath();
              //   // Center gloss on lower lip (outerLip[16] is usually center bottom)
              //   const glossCenter = outerLip[16];
              //   ctx.ellipse(
              //     glossCenter.x * canvas.width,
              //     glossCenter.y * canvas.height,
              //     canvas.width * 0.06,
              //     canvas.height * 0.018,
              //     0,
              //     0,
              //     2 * Math.PI
              //   );
              //   ctx.fillStyle = '#fff';
              //   ctx.fill();
              //   ctx.restore();
              // }

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