// dataService.js - Service for fetching and processing blog data

class DataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Fetch data from your Spring Boot API
  async fetchBlogData() {
    try {
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return this.processBlogData(data);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      return this.getMockData(); // Fallback to mock data
    }
  }

  // Process raw GitHub data into the format expected by the UI
  processBlogData(rawData) {
    const processedData = {};
    
    rawData.forEach(item => {
      const { category, title, content, lastUpdated, id } = item;
      
      if (!processedData[category]) {
        processedData[category] = [];
      }
      
      processedData[category].push({
        id,
        title,
        content,
        lastUpdated: lastUpdated || new Date().toISOString()
      });
    });

    // Sort categories and blogs
    Object.keys(processedData).forEach(category => {
      processedData[category].sort((a, b) => a.title.localeCompare(b.title));
    });

    return processedData;
  }

  // GitHub API integration (if you want to fetch directly from React)
  async fetchFromGitHub(repoOwner, repoName, branch = 'main') {
    const cacheKey = `${repoOwner}/${repoName}/${branch}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents?ref=${branch}`
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const contents = await response.json();
      const blogData = await this.processGitHubContents(contents, repoOwner, repoName, branch);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: blogData,
        timestamp: Date.now()
      });

      return blogData;
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return this.getMockData();
    }
  }

  // Process GitHub repository contents
  async processGitHubContents(contents, repoOwner, repoName, branch) {
    const blogData = {};
    
    // Filter for markdown files and directories
    const markdownFiles = contents.filter(item => 
      item.type === 'file' && item.name.endsWith('.md')
    );
    
    const directories = contents.filter(item => item.type === 'dir');
    
    // Process files in root directory
    for (const file of markdownFiles) {
      const category = 'General';
      const content = await this.fetchFileContent(file.download_url);
      
      if (!blogData[category]) {
        blogData[category] = [];
      }
      
      blogData[category].push({
        id: file.sha,
        title: this.formatTitle(file.name),
        content: content,
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Process directories (categories)
    for (const dir of directories) {
      const dirContents = await this.fetchDirectoryContents(repoOwner, repoName, dir.path, branch);
      const category = this.formatTitle(dir.name);
      
      if (!blogData[category]) {
        blogData[category] = [];
      }
      
      for (const file of dirContents) {
        if (file.type === 'file' && file.name.endsWith('.md')) {
          const content = await this.fetchFileContent(file.download_url);
          
          blogData[category].push({
            id: file.sha,
            title: this.formatTitle(file.name),
            content: content,
            lastUpdated: new Date().toISOString()
          });
        }
      }
    }
    
    return blogData;
  }

  // Fetch directory contents from GitHub
  async fetchDirectoryContents(repoOwner, repoName, path, branch) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching directory contents for ${path}:`, error);
      return [];
    }
  }

  // Fetch file content from GitHub
  async fetchFileContent(downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file content: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching file content:', error);
      return 'Content unavailable';
    }
  }

  // Format file/directory names to readable titles
  formatTitle(filename) {
    return filename
      .replace(/\.(md|txt)$/i, '') // Remove file extensions
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  }

  // Mock data for fallback when API calls fail
  getMockData() {
    const mockData = {
      'JavaScript': [
        {
          id: 'js-001',
          title: 'Understanding Async/Await',
          content: `# Understanding Async/Await in JavaScript

Async/await is a syntax that makes it easier to work with promises in JavaScript. It allows you to write asynchronous code that looks and behaves more like synchronous code.

## What is Async/Await?

The \`async\` keyword is used to declare an asynchronous function, while \`await\` is used to pause the execution of the function until a promise is resolved.

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

This is much cleaner than using traditional promise chains with \`.then()\` and \`.catch()\`.`,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'js-002',
          title: 'ES6 Destructuring Patterns',
          content: `# ES6 Destructuring Patterns

Destructuring is a convenient way to extract values from arrays and objects in JavaScript.

## Array Destructuring

\`\`\`javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]
\`\`\`

## Object Destructuring

\`\`\`javascript
const { name, age, ...others } = person;
console.log(name); // John
console.log(others); // { email: '...', city: '...' }
\`\`\`

Destructuring makes code more readable and concise.`,
          lastUpdated: '2024-01-12T14:45:00Z'
        }
      ],
      'React': [
        {
          id: 'react-001',
          title: 'React Hooks Best Practices',
          content: `# React Hooks Best Practices

React Hooks have revolutionized how we write React components. Here are some best practices to follow.

## useState Hook

Always use functional updates when the new state depends on the previous state:

\`\`\`javascript
// Good
setCount(prevCount => prevCount + 1);

// Avoid
setCount(count + 1);
\`\`\`

## useEffect Hook

Always include dependencies in the dependency array:

\`\`\`javascript
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId is a dependency
\`\`\`

## Custom Hooks

Extract component logic into custom hooks for reusability:

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  
  return { count, increment, decrement };
}
\`\`\``,
          lastUpdated: '2024-01-18T09:15:00Z'
        },
        {
          id: 'react-002',
          title: 'State Management Patterns',
          content: `# State Management Patterns in React

Managing state effectively is crucial for building scalable React applications.

## Local State vs Global State

Use local state for component-specific data and global state for data shared across components.

## Context API

For simple global state management:

\`\`\`javascript
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
\`\`\`

## Reducer Pattern

For complex state logic:

\`\`\`javascript
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}
\`\`\``,
          lastUpdated: '2024-01-20T16:20:00Z'
        }
      ],
      'Node.js': [
        {
          id: 'node-001',
          title: 'Building RESTful APIs',
          content: `# Building RESTful APIs with Node.js

RESTful APIs are the backbone of modern web applications. Here's how to build them with Node.js and Express.

## Setting up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.get('/api/users', getAllUsers);
app.post('/api/users', createUser);
app.get('/api/users/:id', getUserById);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Error Handling

Implement proper error handling middleware:

\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\`

## Validation

Use middleware like express-validator for input validation:

\`\`\`javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  body('email').isEmail(),
  body('name').isLength({ min: 2 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process valid data
  }
);
\`\`\``,
          lastUpdated: '2024-01-14T11:30:00Z'
        }
      ],
      'Web Development': [
        {
          id: 'web-001',
          title: 'CSS Grid vs Flexbox',
          content: `# CSS Grid vs Flexbox: When to Use Which

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.

## Flexbox - One Dimensional Layout

Flexbox is designed for one-dimensional layouts (either row or column):

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

**Best for:**
- Navigation bars
- Centering content
- Distributing space between items
- Simple component layouts

## CSS Grid - Two Dimensional Layout

CSS Grid is designed for two-dimensional layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
\`\`\`

**Best for:**
- Page layouts
- Complex component arrangements
- Overlapping elements
- Responsive design with named grid areas

## Combining Both

You can use Grid for the overall page layout and Flexbox for component-level layouts:

\`\`\`css
.page-layout {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\``,
          lastUpdated: '2024-01-16T13:45:00Z'
        },
        {
          id: 'web-002',
          title: 'Progressive Web Apps',
          content: `# Building Progressive Web Apps (PWAs)

Progressive Web Apps combine the best of web and mobile applications.

## Core Features

1. **Service Workers** - Enable offline functionality
2. **Web App Manifest** - Makes the app installable
3. **HTTPS** - Required for PWA features
4. **Responsive Design** - Works on all devices

## Service Worker Example

\`\`\`javascript
// sw.js
const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});
\`\`\`

## Web App Manifest

\`\`\`json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
\`\`\``,
          lastUpdated: '2024-01-22T08:30:00Z'
        }
      ],
      'General': [
        {
          id: 'general-001',
          title: 'Getting Started with Development',
          content: `# Getting Started with Web Development

Welcome to the world of web development! This guide will help you understand the basics.

## Essential Technologies

### HTML (HyperText Markup Language)
The foundation of web pages. It provides the structure and content.

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

### CSS (Cascading Style Sheets)
Used for styling and layout of web pages.

\`\`\`css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}
\`\`\`

### JavaScript
Adds interactivity and dynamic behavior to web pages.

\`\`\`javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    
    const button = document.querySelector('#myButton');
    button.addEventListener('click', function() {
        alert('Button clicked!');
    });
});
\`\`\`

## Learning Path

1. **Start with HTML & CSS** - Learn the basics of structure and styling
2. **Add JavaScript** - Make your pages interactive
3. **Learn a Framework** - React, Vue, or Angular
4. **Backend Development** - Node.js, Python, or Java
5. **Databases** - SQL and NoSQL databases
6. **DevOps & Deployment** - Git, Docker, cloud platforms

## Development Tools

- **Code Editor**: VS Code, Sublime Text, or Atom
- **Browser DevTools**: Chrome or Firefox developer tools
- **Version Control**: Git and GitHub
- **Package Managers**: npm or yarn`,
          lastUpdated: '2024-01-10T12:00:00Z'
        }
      ]
    };

    return mockData;
  }

  // Clear cache method
  clearCache() {
    this.cache.clear();
  }

  // Get cache info
  getCacheInfo() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export the service
export default DataService;

// Create and export a singleton instance
export const dataService = new DataService();