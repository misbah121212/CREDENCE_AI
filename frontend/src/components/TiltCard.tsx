import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', style = {} }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Rotate max 8 degrees for a subtle, premium look
    const rotateX = -(y / (box.height / 2)) * 6;
    const rotateY = (x / (box.width / 2)) * 6;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.08s ease-out, box-shadow 0.15s ease-out',
      boxShadow: '0 22px 45px -12px rgba(139, 92, 246, 0.22), 0 0 20px rgba(139, 92, 246, 0.08)',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, ...tiltStyle }}
      className={`transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;
