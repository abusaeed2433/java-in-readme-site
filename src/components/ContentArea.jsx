import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Menu } from 'lucide-react';

const ContentArea = ({ blogContent, onToggleMobile, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!blogContent) {
      return (
        <div className="flex items-center justify-center text-gray-300">
          <span>Select a topic and subtopic to view content.</span>
        </div>
      );
    }

    return <MarkdownRenderer content={blogContent} />;
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col h-screen">
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
      <div className="flex-1 overflow-y-auto">
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