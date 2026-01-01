import React, { useState, useEffect } from 'react';
import Notebook from './components/Notebook';
import ResolutionItem from './components/ResolutionItem';
import type { Resolution } from './types';
import { getRandomResolution } from './services/resolutionData';
import { Plus, Wand2, Share2, Pencil, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_RESOLUTIONS: Resolution[] = [
  { id: '1', text: 'Drink more water 💧', completed: false },
  { id: '2', text: 'Read 12 books 📚', completed: false },
  { id: '3', text: 'Learn to juggle 🤹', completed: false },
];

const App: React.FC = () => {
  const [resolutions, setResolutions] = useState<Resolution[]>(() => {
    if (typeof window === 'undefined') return INITIAL_RESOLUTIONS;
    
    const savedRes = localStorage.getItem('my-resolutions-2026');
    if (savedRes) {
      try {
        return JSON.parse(savedRes);
      } catch {
        console.error("Failed to parse saved resolutions");
      }
    }
    return INITIAL_RESOLUTIONS;
  });

  const [title, setTitle] = useState(() => {
    if (typeof window === 'undefined') return "My Resolutions";
    return localStorage.getItem('my-resolutions-title-2026') || "My Resolutions";
  });

  const [lastFocusedId, setLastFocusedId] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isInspiring, setIsInspiring] = useState(false);

  const currentYear = new Date().getFullYear();
  const headerText = currentYear >= 2026 ? "Hello 2026!" : "Goodbye 2025";
  const subHeaderText = currentYear >= 2026 
    ? "Let's try to be better this year" 
    : "Let's try to be better next year";

  useEffect(() => {
    localStorage.setItem('my-resolutions-2026', JSON.stringify(resolutions));
  }, [resolutions]);

  useEffect(() => {
    localStorage.setItem('my-resolutions-title-2026', title);
  }, [title]);

  const addResolution = (text: string = '') => {
    const newRes: Resolution = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
    };
    setResolutions(prev => [...prev, newRes]);
    setLastFocusedId(newRes.id);
  };

  const updateResolution = (id: string, text: string) => {
    setResolutions(prev => prev.map(r => r.id === id ? { ...r, text } : r));
  };

  const deleteResolution = (id: string) => {
    setResolutions(prev => prev.filter(r => r.id !== id));
  };

  const toggleResolution = (id: string) => {
    setResolutions(prev => {
      return prev.map(r => {
        if (r.id === id) {
          const newState = !r.completed;
          if (newState) {
            triggerConfetti();
          }
          return { ...r, completed: newState };
        }
        return r;
      });
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FFD700', '#87CEEB', '#98FB98']
    });
  };

  const handleInspire = async () => {
    setIsInspiring(true);
    // Simulate thinking/ruminating
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const idea = getRandomResolution();
    addResolution(idea);
    setIsInspiring(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    // Small delay to allow state update to hide UI elements
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const notebookElement = document.getElementById('notebook-capture-area');
    
    if (notebookElement) {
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(notebookElement, {
            scale: 2, // Higher quality
            backgroundColor: null, 
        });
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;

          // Try native sharing first (works on mobile for WhatsApp/Twitter)
          if (navigator.share) {
            try {
              const file = new File([blob], 'my-2026-resolutions.png', { type: 'image/png' });
              await navigator.share({
                files: [file],
                title: 'My 2026 Resolutions',
                text: 'Check out my resolutions for 2026! ✨',
              });
              setIsSharing(false);
              return;
            } catch (err) {
              console.log('Sharing failed or cancelled, falling back to download', err);
            }
          }
          
          // Fallback to download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my-2026-resolutions.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsSharing(false);
        }, 'image/png');

      } catch (error) {
        console.error("Error capturing screenshot:", error);
        setIsSharing(false);
        alert("Oops! Couldn't create the image. Try taking a screenshot manually.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col items-center py-8 px-4 font-sans text-gray-800">
      
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl mb-6 text-center"
      >
        <h1 className="marker-font text-5xl md:text-6xl text-indigo-500 transform -rotate-2 drop-shadow-sm mb-2">
          {headerText}
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-handwritten text-xl text-gray-500"
        >
          {subHeaderText} ✨
        </motion.p>
      </motion.div>

      {/* Main Notebook Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl relative"
      >
        
        {/* We capture THIS component */}
        <Notebook id="notebook-capture-area" className="min-h-[600px] mb-8 relative z-10 pb-16">
          <div className="mb-6 border-b-2 border-dashed border-indigo-200 pb-2 flex items-center">
            {/* Editable Title */}
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="handwritten text-4xl text-gray-700 bg-transparent border-none focus:ring-0 w-full placeholder-gray-400"
              placeholder="My Resolutions:"
            />
            {!isSharing && <Pencil size={20} className="text-gray-300 ml-2" />}
          </div>

          <div className="space-y-0">
            <AnimatePresence mode="popLayout">
              {resolutions.map((res, idx) => (
                <ResolutionItem
                  key={res.id}
                  index={idx}
                  resolution={res}
                  onUpdate={updateResolution}
                  onDelete={deleteResolution}
                  onToggle={toggleResolution}
                  isFocused={res.id === lastFocusedId}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Floating Buttons inside Notebook to flow with content */}
          {!isSharing && (
            <motion.div 
              layout
              className="mt-4 flex gap-3 pl-8 md:pl-0 opacity-90 hover:opacity-100 transition-opacity"
            >
               <motion.button
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addResolution('')}
                className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100/50 hover:bg-yellow-200/50 text-yellow-800 rounded-xl text-sm font-bold transition-colors shadow-sm handwritten border border-yellow-200"
              >
                <Plus size={16} /> Add Item
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInspire}
                disabled={isInspiring}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-sm font-bold transition-colors shadow-sm handwritten border border-purple-200"
              >
                {isInspiring ? (
                   <span className="animate-spin">
                     <Loader2 size={16} />
                   </span>
                ) : (
                   <Wand2 size={16} />
                )} 
                {isInspiring ? "Thinking..." : "Inspire Me"}
              </motion.button>
            </motion.div>
          )}

          {/* Extra space at bottom of page */}
          <div className="h-12"></div>
        </Notebook>

        {/* Floating Share Button */}
        <motion.div 
          className="fixed bottom-6 right-6 md:right-12 z-30"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
        >
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg transition-colors marker-font tracking-wide"
          >
            {isSharing ? <Sparkles className="animate-spin" size={24} /> : <Share2 size={24} />}
            <span className="text-xl">Share Snapshot</span>
          </motion.button>
        </motion.div>

      </motion.div>

      <footer className="mt-8 text-gray-400 text-sm handwritten">
        <p>Built with magic & React. Stud.io</p>
      </footer>
    </div>
  );
};

export default App;