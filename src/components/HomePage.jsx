import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchRepos, fetchIndices } from '../services/dataService';

const HomePage = () => {
  const [repos, setRepos] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [reposData, topicsData] = await Promise.all([
        fetchRepos(),
        fetchIndices()
      ]);
      setRepos(reposData);

      const topicNames = topicsData.map(topic => topic.topic_name);
      setTopics(topicNames);
      console.log('Fetched Topics:', topicNames);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-2">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-4 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Java in README
        </motion.h1>
        
        {/* Topics Grid */}
        <motion.div 
          className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 px-3 py-1.5 rounded-full border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                background: `linear-gradient(to right, rgba(30, 41, 59, 0.5) ${index % 2 ? '0%' : '100%'}, rgba(51, 65, 85, 0.5) ${index % 2 ? '100%' : '0%'})` 
              }}
              transition={{ 
                delay: index * 0.05,
                background: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <span className="text-slate-300 text-sm font-medium">
                {topic}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Repository Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {repos.map((repo, index) => (
          <motion.div 
            key={index} 
            className={`bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col border ${
              index === 0 ? 'bg-yellow-500/10 border-yellow-500/20' :
              index === 1 ? 'bg-green-500/10 border-green-500/20' :
              'bg-slate-700/50 border-slate-600/20'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Card Content */}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className={`text-xl font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-green-400' :
                    'text-white'
                  }`}>{repo.name}</h2>
                  <div className="flex gap-2 mt-1">
                    {index === 0 && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                        source
                      </span>
                    )}
                    {index === 1 && (
                      <>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                          spring
                        </span>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                          backend
                        </span>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          react
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          frontend
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <a 
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <p className="text-slate-300 mb-1">
                {repo.description || 'No description available'}
              </p>

              {/* <div className="flex space-x-4 mb-4">
                <div className="flex items-center text-slate-300">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{repo.stars || 0}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <GitFork className="w-4 h-4 mr-1" />
                  <span>{repo.forks || 0}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{repo.watchers || 0}</span>
                </div>
              </div> */}
            </div>

            {/* Contributor Section */}
            {repo.contribution && repo.contribution[0] && (
              <motion.div 
                className="border-t border-slate-600 mt-2 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={repo.contribution[0].profile_url}
                    alt={repo.contribution[0].user_name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-white font-medium">{repo.contribution[0].user_name}</h3>
                    <p className="text-slate-300 text-sm">
                      {repo.contribution[0].contribution_count} contributions
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;
