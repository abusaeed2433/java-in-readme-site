import { Menu, Code, BookOpen, Globe } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const ContentArea = ({ selectedBlog, onToggleMobile }) => {
  if (!selectedBlog) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Code className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Java Tutorials</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Select a tutorial from the sidebar to start learning Java programming concepts and best practices.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Comprehensive Guides</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Code className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Code Examples</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Easy to Read</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-screen">
      {/* Mobile Header - Fixed */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <button 
          onClick={onToggleMobile}
          className="text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Content Container - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>Last updated: {new Date(selectedBlog.lastUpdated).toLocaleDateString()}</span>
              <span>•</span>
              <span>Java Tutorial</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <MarkdownRenderer content={selectedBlog.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentArea;