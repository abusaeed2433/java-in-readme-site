import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
      <MarkdownPreview 
        source={content}
        wrapperElement={{
          "data-color-mode": "dark"
        }}
        style={{
          backgroundColor: 'transparent',
          color: '#e5e7eb', // text-gray-300
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;