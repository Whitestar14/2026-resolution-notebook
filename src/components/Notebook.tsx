import React from 'react';

interface NotebookProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Notebook: React.FC<NotebookProps> = ({ children, className = '', id }) => {
  return (
    <div id={id} className={`relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {/* Spiral Binding Effect */}
      <div className="absolute top-0 left-0 bottom-0 w-8 md:w-12 bg-gray-100 border-r border-gray-300 z-10 flex flex-col items-center justify-start py-4 space-y-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-full h-4 relative">
            <div className="absolute left-2 w-4 h-4 rounded-full bg-gray-800 shadow-inner"></div>
            <div className="absolute left-4 w-6 h-2 top-1 bg-gray-400 rounded-full transform -rotate-12 shadow-sm"></div>
          </div>
        ))}
      </div>

      {/* Page Content */}
      <div className="ml-8 md:ml-12 min-h-[600px] h-full relative paper-texture">
        {/* Red Margin Line */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 w-px bg-red-200 z-0"></div>
        
        <div className="relative z-10 h-full p-4 md:p-8 paper-lines">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Notebook;