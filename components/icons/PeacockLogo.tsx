import React from 'react';
import crestImage from '../../assets/peacock-crest.png';

export const PeacockLogo: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={crestImage}
    alt="Golden peacock crest"
    className={`object-contain drop-shadow-xl ${className ?? ''}`}
    loading="lazy"
  />
);
