import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchRepos } from '../services/dataService';

const HomePage = () => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const loadRepos = async () => {
      const reposData = await fetchRepos();
      setRepos(reposData);
    };

    loadRepos();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo, index) => (
        <div key={index} className="bg-slate-700 rounded-lg p-6 shadow-lg flex flex-col">
          {/* Card Content */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">{repo.name}</h2>
              <a 
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            <p className="text-slate-300 mb-4">
              {repo.description || 'No description available'}
            </p>
          </div>

          {/* Contributor Section */}
          {repo.contribution && repo.contribution[0] && (
            <div className="border-t border-slate-600 mt-4 pt-4">
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;