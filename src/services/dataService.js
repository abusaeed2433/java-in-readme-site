import { data } from "autoprefixer";

// Fetch indices from your Spring Boot API
export async function fetchIndices() {
  try {
    const response = await fetch('http://localhost:8082/api/v1/read_indices');
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
    const url = `http://localhost:8082/api/v1/read_blog?topic_name=${encodeURIComponent(topicName)}&sub_topic_name=${encodeURIComponent(subTopicName)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched blog content:', data.data.content);

    return data.data.content || 'Content unavailable'; // Return content or a fallback message
  } catch (error) {
    console.error('Error fetching blog:', error);
    return 'Content unavailable';
  }
}
