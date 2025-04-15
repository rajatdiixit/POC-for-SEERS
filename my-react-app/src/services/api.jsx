import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Adjust to your FastAPI server URL

export const getLearningOutcomes = async (prompt, grade) => {
  try {
    const response = await axios.post(`${API_URL}/generate-learning-outcomes/`, { prompt, grade });
    return response.data;
  } catch (error) {
    console.error('Error fetching learning outcomes:', error);
    throw error;
  }
};

export const getDisambiguationTags = async (prompt, grade) => {
  try {
    const response = await axios.post(`${API_URL}/generate-disambiguation-tags/`, { prompt, grade });
    return response.data;
  } catch (error) {
    console.error('Error fetching disambiguation tags:', error);
    throw error;
  }
};

export const getLessonPlan = async (prompt, grade, learning_outcomes, disambiguation_tags) => {
  try {
    const response = await axios.post(`${API_URL}/generate-lesson-plan/`, {
      prompt,
      grade,
      learning_outcomes,
      disambiguation_tags
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson plan:', error);
    throw error;
  }
};