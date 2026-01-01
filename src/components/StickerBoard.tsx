import React from 'react';
import type { Sticker } from '../types';

interface StickerBoardProps {
  stickers: Sticker[];
}

const StickerBoard: React.FC<StickerBoardProps> = ({ stickers }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute text-4xl filter drop-shadow-md transform transition-transform duration-500 hover:scale-110"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            transform: `rotate(${sticker.rotation}deg)`,
          }}
        >
          {sticker.emoji}
        </div>
      ))}
    </div>
  );
};

export default StickerBoard;