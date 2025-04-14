import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getLearningOutcomes = async (prompt, grade) => {
  try {
    const response = await axios.post(`${API_URL}/generate-learning-outcomes/`, {
      prompt,
      grade,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Axios Error:', error);
    throw error;
  }
};

export const getDisambiguationTags = async (prompt, grade) => {
  try {
    const response = await axios.post(`${API_URL}/generate-disambiguation-tags/`, {
      prompt,
      grade,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Axios Error:', error);
    throw error;
  }
};

export const getLessonPlan = async (prompt, grade, learningOutcomes, disambiguationTags) => {
  try {
    const response = await axios.post(`${API_URL}/generate-lesson-plan/`, {
      prompt,
      grade,
      learning_outcomes: learningOutcomes,
      disambiguation_tags: disambiguationTags,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Axios Error:', error);
    throw error;
  }
};