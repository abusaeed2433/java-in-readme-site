import React from 'react';

const MarkdownRenderer = ({ content }) => {
  // Enhanced markdown renderer with syntax highlighting support
  const renderMarkdown = (text) => {
    return text
      // Headers
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-700 mb-3 mt-6">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h4>')
      
      // Code blocks (simple version - you might want to use a proper syntax highlighter)
      .replace(/```java\n([\s\S]*?)\n```/g, '<div class="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto"><pre class="text-green-400 text-sm"><code>$1</code></pre></div>')
      .replace(/```([\s\S]*?)```/g, '<div class="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto border-l-4 border-blue-500"><pre class="text-gray-800 text-sm"><code>$1</code></pre></div>')
      
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-purple-600 border">$1</code>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists (basic implementation)
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-2 list-disc">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 list-decimal">$1</li>')
      
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">$1</blockquote>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-700">')
      .replace(/\n/g, '<br>');
  };

  // Wrap the content and clean up list formatting
  const processedContent = renderMarkdown(content);
  const finalContent = processedContent
    .replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
      return `<ul class="list-disc list-inside mb-4 space-y-1">${match}</ul>`;
    });

  return (
    <div className="prose prose-lg max-w-none">
      <div 
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: `<p class="mb-4 leading-relaxed text-gray-700">${finalContent}</p>` 
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;