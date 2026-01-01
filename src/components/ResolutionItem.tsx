import React, { useRef, useEffect, useState } from 'react';
import type { Resolution } from '../types';
import { Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResolutionItemProps {
  resolution: Resolution;
  index: number;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isFocused?: boolean;
}

const ResolutionItem: React.FC<ResolutionItemProps> = ({ 
  resolution, 
  index, 
  onUpdate, 
  onDelete, 
  onToggle,
  isFocused 
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showActions, setShowActions] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-resize logic
  const adjustHeight = () => {
    const el = inputRef.current;
    if (el) {
      el.style.height = 'auto'; // Reset to calculate scrollHeight
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [resolution.text]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isFocused]);

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowActions(true);
    }, 600); // 600ms threshold for long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="group flex items-start relative hover:bg-yellow-50/50 transition-colors rounded px-2 -mx-2"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Numbering - aligned with the first line of text via top padding */}
      <span className="text-gray-400 font-bold mr-3 w-6 text-right select-none" style={{ lineHeight: '29px' }}>
        {index + 1}.
      </span>
      
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={resolution.text}
          onChange={(e) => {
            onUpdate(resolution.id, e.target.value);
            adjustHeight();
          }}
          placeholder="Write a resolution..."
          rows={1}
          className={`w-full bg-transparent border-none focus:ring-0 p-0 text-xl text-gray-700 placeholder-gray-300 handwritten resize-none overflow-hidden ${resolution.completed ? 'line-through text-gray-400' : ''}`}
          style={{ 
            lineHeight: '29px',
            paddingTop: '0px',
            paddingBottom: '0px'
          }}
        />
      </div>

      <div className={`flex items-center space-x-2 transition-opacity ml-2 pt-[2px] ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <motion.button 
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            onToggle(resolution.id);
            setShowActions(false);
          }}
          className={`p-1 rounded-full ${resolution.completed ? 'text-green-500 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
          title={resolution.completed ? "Mark as active" : "Mark as done"}
        >
          {resolution.completed ? <X size={16} /> : <Check size={16} />}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            onDelete(resolution.id);
            setShowActions(false);
          }}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
          title="Delete"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResolutionItem;