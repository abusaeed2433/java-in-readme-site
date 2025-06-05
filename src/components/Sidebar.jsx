import React, { useState } from 'react';
import { Search, Code, X, ChevronRight, ChevronLeft, ChevronDown, ChevronRightSquare, BookOpen } from 'lucide-react';

const Sidebar = ({ 
  indices = [],
  selectedTopic,
  selectedSubTopic,
  onSelectSubTopic,
  searchTerm,
  onSearchChange,
  isMobileOpen,
  onToggleMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [expandedTopics, setExpandedTopics] = useState({});

  // Filter topics and subtopics by search
  const filteredIndices = indices
    .filter(topic =>
      topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.subTopicList.some(sub =>
        sub.sub_topic_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .map(topic => ({
      ...topic,
      subTopicList: topic.subTopicList.filter(sub =>
        sub.sub_topic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }));

  const handleToggleTopic = (topicName) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicName]: !prev[topicName],
    }));
  };

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
      <div className={`fixed lg:sticky top-0 left-0 h-screen ${isCollapsed ? 'w-16' : 'w-64'} bg-slate-900 border-r border-slate-700 z-50 transform transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header - Fixed height */}
        <div className={`p-4 border-b border-slate-700 ${isCollapsed ? 'flex justify-center' : ''} h-[120px]`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="relative group">
                <button 
                  onClick={onToggleCollapse}
                  className="p-2 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <ChevronRightSquare className="w-6 h-6" />
                </button>
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Expand sidebar
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Java In Readme</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={onToggleCollapse}
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-all duration-200"
                  >
                    {/* <span className="text-sm font-medium">Collapse</span> */}
                    <ChevronLeft className="w-5 h-5" />
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
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation - Scrollable area */}
        <div className="h-[calc(100vh-120px)] flex flex-col">
          {!isCollapsed ? (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
              {filteredIndices.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No topics found</p>
                </div>
              )}
              {filteredIndices.map(topic => (
                <div key={topic.topic_name} className="mb-2">
                  <button
                    className={`group flex items-center w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      selectedTopic === topic.topic_name
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-200 hover:bg-slate-800/50 hover:text-white'
                    }`}
                    onClick={() => handleToggleTopic(topic.topic_name)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="font-medium capitalize truncate mr-3">{topic.topic_name.replace(/_/g, ' ')}</span>
                      {topic.no_of_sub_topics > 0 && (
                        <div className={`ml-auto transform transition-transform duration-200 ${
                          expandedTopics[topic.topic_name] ? 'rotate-90' : ''
                        }`}>
                          <ChevronRight className="w-4 h-4 opacity-75" />
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Subtopics with enhanced styling */}
                  {topic.no_of_sub_topics > 0 && expandedTopics[topic.topic_name] && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-700">
                      {topic.subTopicList.map(sub => (
                        <button
                          key={sub.sub_topic_name}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default behavior
                            onSelectSubTopic(topic.topic_name, sub.sub_topic_name);
                          }}
                          type="button" // Explicitly set button type
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 my-1
                            ${selectedTopic === topic.topic_name && selectedSubTopic === sub.sub_topic_name
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white font-medium'
                              : 'text-gray-300 hover:bg-slate-800/30 hover:text-white'
                            }`}
                        >
                          <span className="relative z-10 block truncate">{sub.sub_topic_name.replace(/_/g, ' ')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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