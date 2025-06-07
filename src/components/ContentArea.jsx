import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import HomePage from './HomePage';
import { Menu, X } from 'lucide-react';

const ContentArea = ({ blogContent, onToggleMobile, isLoading, onClose }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!blogContent) {
      return <HomePage />;
    }

    return (
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 text-gray-400 hover:text-white"
          title="Close content"
        >
          <X className="w-5 h-5" />
        </button>
        <MarkdownRenderer content={blogContent} />
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col min-h-screen max-h-screen">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex-shrink-0">
        <button 
          onClick={onToggleMobile}
          className="text-gray-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="w-[95%] mx-auto py-8 px-4">
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
