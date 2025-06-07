import { data } from "autoprefixer";

const API_BASE_URL = 'https://apiendpoint.site/jir/api/v1';

// Fetch indices from your Spring Boot API
export async function fetchIndices() {
  try {
    const response = await fetch(`${API_BASE_URL}/read_indices`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Return the array of topics
    return data.data || [];
  } catch (error) {
    console.error('Error fetching indices:', error);
    return [];
  }
}

// Fetch blog content for a topic and subtopic
export async function fetchBlog(topicName, subTopicName) {
  try {
    const url = `${API_BASE_URL}/read_blog?topic_name=${encodeURIComponent(topicName)}&sub_topic_name=${encodeURIComponent(subTopicName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched blog content:', data.data.content);
    
    return data.data.content || 'Content unavailable';
  } catch (error) {
    console.error('Error fetching blog:', error);
    return 'Content unavailable';
  }
}

export async function fetchRepos() {
  try {
    const response = await fetch(`${API_BASE_URL}/read_contributions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
}
