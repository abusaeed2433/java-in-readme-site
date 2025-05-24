import React from 'react';
import { Search, Code, X, BookOpen, ChevronRight, ChevronLeft, ChevronRightSquare } from 'lucide-react';

const Sidebar = ({ 
  blogData, 
  selectedBlog, 
  onSelectBlog, 
  searchTerm, 
  onSearchChange, 
  isMobileOpen, 
  onToggleMobile,
  isCollapsed,
  onToggleCollapse
}) => {
  const filteredData = Object.entries(blogData).reduce((acc, [category, blogs]) => {
    const filteredBlogs = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredBlogs.length > 0) {
      acc[category] = filteredBlogs;
    }
    return acc;
  }, {});

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleMobile}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 h-screen ${isCollapsed ? 'w-20' : 'w-80'} bg-slate-900 border-r border-slate-700 z-50 transform transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header - Fixed height */}
        <div className={`p-4 border-b border-slate-700 ${isCollapsed ? 'flex justify-center' : ''} h-[120px]`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center">
              <button 
                onClick={onToggleCollapse}
                className="p-2 text-gray-400 hover:text-white mb-4"
              >
                <ChevronRightSquare className="w-6 h-6" />
              </button>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">Java Tutorials</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={onToggleCollapse}
                    className="hidden lg:block text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={onToggleMobile}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation - Scrollable area */}
        <div className="h-[calc(100vh-120px)] flex flex-col">
          {!isCollapsed ? (
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(filteredData).map(([category, blogs]) => (
                <div key={category} className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 px-2">
                    {category}
                  </h2>
                  <div className="space-y-1">
                    {blogs.map((blog) => (
                      <button
                        key={blog.id}
                        onClick={() => onSelectBlog(blog)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                          selectedBlog?.id === blog.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{blog.title}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            selectedBlog?.id === blog.id ? 'rotate-90' : 'group-hover:translate-x-1'
                          }`} />
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          Updated: {new Date(blog.lastUpdated).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(filteredData).length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tutorials found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center pt-4">
              <button 
                onClick={onToggleCollapse}
                className="p-2 text-gray-400 hover:text-white"
              >
                <ChevronRightSquare className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;