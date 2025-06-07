import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import { fetchIndices, fetchBlog } from './services/dataService';

export default function App() {
  const [indices, setIndices] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [blogContent, setBlogContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For initial load only
  const [contentLoading, setContentLoading] = useState(false); // For content updates
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load indices on mount
  useEffect(() => {
    const loadIndices = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const data = await fetchIndices();
        setIndices(data);
      } catch (err) {
        setError('Failed to load topics. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };
    loadIndices();
  }, []);

  // Load blog content when topic/subtopic changes
  useEffect(() => {
    const loadBlog = async () => {
      if (selectedTopic && selectedSubTopic) {
        setContentLoading(true);
        try {
          const content = await fetchBlog(selectedTopic, selectedSubTopic);
          setBlogContent(content);
        } catch (err) {
          setError('Failed to load content. Please try again later.');
        } finally {
          setContentLoading(false);
        }
      }
    };
    loadBlog();
  }, [selectedTopic, selectedSubTopic]);

  // Add this useEffect to handle initial URL and popstate events
  useEffect(() => {
    // Parse URL on initial load
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const topic = params.get('topic');
      const subtopic = params.get('subtopic');
      
      if (topic && subtopic) {
        setSelectedTopic(decodeURIComponent(topic));
        setSelectedSubTopic(decodeURIComponent(subtopic));
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      parseUrl();
    };

    parseUrl();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectSubTopic = (topic, subTopic) => {
    setSelectedTopic(topic);
    setSelectedSubTopic(subTopic);
    setIsMobileMenuOpen(false);

    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('topic', encodeURIComponent(topic));
    url.searchParams.set('subtopic', encodeURIComponent(subTopic));
    window.history.pushState({}, '', url);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleClose = () => {
    setSelectedTopic(null);
    setSelectedSubTopic(null);
    setBlogContent('');

    // Remove query parameters from URL
    const url = new URL(window.location);
    url.searchParams.delete('topic');
    url.searchParams.delete('subtopic');
    window.history.pushState({}, '', url);
  };

  // Show loading only for initial load
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Java tutorials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center bg-slate-800 p-8 rounded-lg shadow-md">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">Error Loading Tutorials</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar 
        indices={indices}
        selectedTopic={selectedTopic}
        selectedSubTopic={selectedSubTopic}
        onSelectSubTopic={handleSelectSubTopic}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isMobileOpen={isMobileMenuOpen}
        onToggleMobile={toggleMobileMenu}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <ContentArea 
        selectedTopic={selectedTopic}
        selectedSubTopic={selectedSubTopic}
        blogContent={blogContent}
        onToggleMobile={toggleMobileMenu}
        isLoading={contentLoading}
        onClose={handleClose}
      />
    </div>
  );
}