import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import { dataService } from './services/dataService';

export default function App() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogData, setBlogData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load blog data on component mount
  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from your API first, fallback to mock data
        // const data = await dataService.fetchBlogData();
        // setBlogData(data);
        
        // If you want to fetch directly from GitHub, uncomment this:
        const data = await dataService.fetchFromGitHub('abusaeed2433', 'JavaInREADME');
        console.log('Fetched blog data:', data);
        setBlogData(data);
        
      } catch (err) {
        console.error('Error loading blog data:', err);
        setError('Failed to load tutorials. Please try again later.');
        // Use mock data as fallback
        // setBlogData(dataService.getMockData());
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const refreshData = async () => {
    dataService.clearCache();
    const data = await dataService.fetchBlogData();
    setBlogData(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Java tutorials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Tutorials</h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        blogData={blogData}
        selectedBlog={selectedBlog}
        onSelectBlog={handleSelectBlog}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isMobileOpen={isMobileMenuOpen}
        onToggleMobile={toggleMobileMenu}
        onRefresh={refreshData}
      />
      <ContentArea 
        selectedBlog={selectedBlog}
        onToggleMobile={toggleMobileMenu}
      />
    </div>
  );
}