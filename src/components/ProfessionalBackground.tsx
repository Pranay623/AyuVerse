import React, { useRef, useEffect } from 'react';

interface ProfessionalBackgroundProps {
  className?: string;
}

const ProfessionalBackground: React.FC<ProfessionalBackgroundProps> = ({
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const drawGradient = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      // Create a sophisticated gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f0f23'); // Deep navy
      gradient.addColorStop(0.3, '#1a1a2e'); // Dark blue
      gradient.addColorStop(0.6, '#16213e'); // Darker blue
      gradient.addColorStop(1, '#0f3460'); // Deep blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add subtle geometric patterns
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      // Draw subtle grid
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      for (let i = 0; i < height; i += 60) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      // Add subtle dots pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      for (let i = 0; i < width; i += 40) {
        for (let j = 0; j < height; j += 40) {
          if ((i + j) % 80 === 0) {
            ctx.beginPath();
            ctx.arc(i, j, 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    resizeCanvas();
    drawGradient();

    const handleResize = () => {
      resizeCanvas();
      drawGradient();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default ProfessionalBackground;
