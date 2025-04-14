import React, { useState, useEffect, useCallback } from 'react';
import { X, Paperclip, Mic, Plus } from 'lucide-react';
import { getLearningOutcomes, getDisambiguationTags, getLessonPlan } from '../services/api';

const LessonPlanDialog = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('High School');
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [disambiguationTags, setDisambiguationTags] = useState([]);
  const [selectedLearningOutcomes, setSelectedLearningOutcomes] = useState([]);
  const [selectedDisambiguationTags, setSelectedDisambiguationTags] = useState([]);
  const [lessonPlan, setLessonPlan] = useState('');
  const [error, setError] = useState(null);
  const [isLoadingOutcomes, setIsLoadingOutcomes] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  // Debounce function for API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch learning outcomes with debounce
  const fetchLearningOutcomes = useCallback(
    debounce(async (prompt, grade) => {
      if (!prompt || !grade) return;
      console.log('Fetching learning outcomes for:', prompt, grade);
      setIsLoadingOutcomes(true);
      try {
        const response = await getLearningOutcomes(prompt, grade);
        console.log('Learning Outcomes Response:', response);
        if (response.learning_outcomes && Array.isArray(response.learning_outcomes)) {
          setLearningOutcomes(response.learning_outcomes.map(lo => ({ id: Date.now() + Math.random(), name: lo, selected: false })));
        } else {
          console.warn('Invalid learning outcomes response:', response);
          setLearningOutcomes([]);
          setError('Invalid learning outcomes data received from API.');
        }
      } catch (err) {
        console.error('Learning Outcomes Error:', err.response ? err.response.data : err.message);
        setError('Failed to load learning outcomes. Check console for details.');
      } finally {
        setIsLoadingOutcomes(false);
      }
    }, 3000),
    []
  );

  // Fetch disambiguation tags with debounce
  const fetchDisambiguationTags = useCallback(
    debounce(async (prompt, grade) => {
      if (!prompt || !grade) return;
      console.log('Fetching disambiguation tags for:', prompt, grade);
      setIsLoadingTags(true);
      try {
        const response = await getDisambiguationTags(prompt, grade);
        console.log('Disambiguation Tags Response:', response);
        if (response.disambiguation_tags && Array.isArray(response.disambiguation_tags)) {
          setDisambiguationTags(response.disambiguation_tags.map(dt => ({ id: Date.now() + Math.random(), name: dt, selected: false })));
        } else {
          console.warn('Invalid disambiguation tags response:', response);
          setDisambiguationTags([]);
          setError('Invalid disambiguation tags data received from API.');
        }
      } catch (err) {
        console.error('Disambiguation Tags Error:', err.response ? err.response.data : err.message);
        setError('Failed to load disambiguation tags. Check console for details.');
      } finally {
        setIsLoadingTags(false);
      }
    }, 3000),
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (gradeLevel && topic) {
      fetchLearningOutcomes(topic, gradeLevel);
      fetchDisambiguationTags(topic, gradeLevel);
    } else {
      setLearningOutcomes([]);
      setDisambiguationTags([]);
      setError(null);
    }
  }, [gradeLevel, topic, fetchLearningOutcomes, fetchDisambiguationTags]);

  const toggleLearningOutcome = (outcome) => {
    setSelectedLearningOutcomes(prev =>
      prev.includes(outcome)
        ? prev.filter(o => o !== outcome)
        : [...prev, outcome]
    );
  };

  const toggleDisambiguationTag = (tag) => {
    setSelectedDisambiguationTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearLearningOutcomes = () => setSelectedLearningOutcomes([]);
  const clearDisambiguationTags = () => setSelectedDisambiguationTags([]);

  const generateLessonPlan = async () => {
    try {
      const plan = await getLessonPlan(topic, gradeLevel, selectedLearningOutcomes, selectedDisambiguationTags);
      console.log('Lesson Plan:', plan);
      setLessonPlan(plan.lesson_plan);
      onClose(); // Close dialog after generating
    } catch (err) {
      console.error('Generate Error:', err.response ? err.response.data : err.message);
      setError('Failed to generate lesson plan. Check console for details.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50" onClick={(e) => {
        e.stopPropagation(); // Prevent close on overlay click if needed, but keep for intentional close
        onClose();
      }} style={{ zIndex: 9999 }} />
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 10000 }}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4" style={{ minHeight: '500px' }}>
          <div className="p-6 pb-2">
            <div className="flex items-center">
              <div className="text-[#0A58FF] text-2xl mr-3">✱</div>
              <h2 className="text-[28px] font-semibold text-[#020105]">Create Lesson Plan</h2>
              <button onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} className="ml-auto p-2 rounded-full hover:bg-[#F0F0F4] text-[#585D69]">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-6 pt-4">
            <form>
              <div className="mb-6">
                <label className="block text-[#585D69] text-lg mb-2">
                  Enter your topic or description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Potential of becoming a prompt engineer in 2025"
                    className="w-full px-4 py-3 border border-[#D2D2D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A58FF] focus:border-transparent"
                  />
                  <div className="absolute right-3 top-3 flex space-x-2">
                    <button type="button" className="text-[#585D69] hover:text-[#020105]">
                      <Paperclip size={20} />
                    </button>
                    <button type="button" className="text-[#585D69] hover:text-[#020105]">
                      <Mic size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-[#585D69] text-lg mb-2">
                  Grade/Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D2D2D2] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0A58FF] focus:border-transparent"
                >
                  <option value="Pre-K">Pre-K</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                </select>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[#585D69] text-lg">
                    Suggestions <span className="text-red-500">*</span>
                  </label>
                  <button onClick={clearLearningOutcomes} className="text-[#585D69] text-sm hover:text-[#020105]">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoadingOutcomes ? (
                    <p className="text-[#585D69]">Loading learning outcomes...</p>
                  ) : learningOutcomes.length > 0 ? (
                    learningOutcomes.map((outcome) => (
                      <button
                        key={outcome.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLearningOutcome(outcome.name);
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selectedLearningOutcomes.includes(outcome.name)
                            ? 'bg-[#0A58FF] text-white border border-[#0A58FF]'
                            : 'bg-[#EEEEEE] text-[#585D69] border border-transparent'
                        }`}
                      >
                        {outcome.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-[#585D69]"></p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[#585D69] text-lg">
                    What's this about ? <span className="text-red-500">*</span>
                  </label>
                  <button onClick={clearDisambiguationTags} className="text-[#585D69] text-sm hover:text-[#020105]">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoadingTags ? (
                    <p className="text-[#585D69]">Loading disambiguation tags...</p>
                  ) : disambiguationTags.length > 0 ? (
                    disambiguationTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDisambiguationTag(tag.name);
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selectedDisambiguationTags.includes(tag.name)
                            ? 'bg-[#0A58FF] text-white border border-[#0A58FF]'
                            : 'bg-[#EEEEEE] text-[#585D69] border border-transparent'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-[#585D69]"></p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateLessonPlan();
                  }}
                  className="flex items-center gap-2 bg-[#0A58FF] hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4H4V7H7V4Z" fill="white"/>
                    <path d="M7 9H4V12H7V9Z" fill="white"/>
                    <path d="M4 14H7V17H4V14Z" fill="white"/>
                    <path d="M9 4H12V7H9V4Z" fill="white"/>
                    <path d="M12 9H9V12H12V9Z" fill="white"/>
                    <path d="M9 14H12V17H9V14Z" fill="white"/>
                    <path d="M14 4H17V7H14V4Z" fill="white"/>
                    <path d="M17 9H14V12H17V9Z" fill="white"/>
                    <path d="M14 14H17V17H14V14Z" fill="white"/>
                  </svg>
                  <span className="font-medium">Generate</span>
                </button>
              </div>
              {lessonPlan && <div className="p-4 mt-4 bg-gray-100 rounded">{lessonPlan}</div>}
              {error && <div className="p-4 mt-4 text-red-500">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonPlanDialog;