import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLessonPlan } from '../services/api';
import './LessonPlan.css';

const LessonPlan = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lessonPlan, setLessonPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonPlan = async () => {
      if (!state || !state.topic || !state.gradeLevel) {
        setError('No lesson plan data provided. Please generate one first.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { topic, gradeLevel, learningOutcomes, disambiguationTags } = state;
        const response = await getLessonPlan(topic, gradeLevel, learningOutcomes, disambiguationTags);
        if (response && response.lesson_plan) {
          setLessonPlan(response.lesson_plan);
        } else {
          setError('Invalid lesson plan data received.');
        }
      } catch (err) {
        console.error('Generate Error:', err.response ? err.response.data : err.message);
        setError('Failed to generate lesson plan. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonPlan();
  }, [state]);

  if (isLoading) {
    return (
      <div className="lesson-plan-container">
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="animate-spin"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0A58FF" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="#0A58FF"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-[#585D69] text-base font-roboto">Generating lesson plan...</span>
        </div>
      </div>
    );
  }

  if (error || !lessonPlan) {
    return (
      <div className="lesson-plan-container">
        <p className="text-[#585D69] text-center text-base font-roboto">
          {error || 'No lesson plan available. Please generate one first.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-[#0A58FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-plan-container">
      <div className="lesson-plan-split">
        {/* Left Column - Document Editor (75%) */}
        <div className="editor-pane">
          <div className="editor-header">
            <span>Document Editor</span>
          </div>
          <textarea
            className="editor-content"
            value={lessonPlan}
            readOnly
            placeholder="Lesson plan will appear here..."
          />
        </div>

        {/* Right Column - AI Assistant (25%) */}
        <div className="assistant-pane">
          <div className="assistant-header">
            <span>AI Assistant</span>
          </div>
          <div className="assistant-content">
            <p>Suggested Changes:</p>
            <ul>
              <li>+ Add introduction section</li>
              <li>+ Adjust learning outcomes</li>
              <li>+ Include activities</li>
            </ul>
            <div className="assistant-actions">
              <button>Accept Changes</button>
              <button>Revert Changes</button>
            </div>
            <div className="assistant-options">
              <button>Generate Draft</button>
              <button>Check Grammar</button>
              <input type="text" placeholder="Ask the AI assistant..." />
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-[#0A58FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
};

export default LessonPlan;