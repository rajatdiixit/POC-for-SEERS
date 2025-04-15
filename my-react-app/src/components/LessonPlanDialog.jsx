import React, { useState, useEffect, useCallback } from 'react';
import { X, Paperclip, Mic, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLearningOutcomes, getDisambiguationTags } from '../services/api';

const LessonPlanDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
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
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAddingOutcome, setIsAddingOutcome] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchLearningOutcomes = useCallback(
    debounce(async (prompt, grade) => {
      if (!prompt || !grade) return;
      setIsLoadingOutcomes(true);
      setError(null);
      try {
        const response = await getLearningOutcomes(prompt, grade);
        if (response.learning_outcomes && Array.isArray(response.learning_outcomes)) {
          setLearningOutcomes(response.learning_outcomes.map(lo => ({ id: Date.now() + Math.random(), name: lo, selected: false })));
        } else {
          setLearningOutcomes([]);
          setError('Invalid learning outcomes data received.');
        }
      } catch (err) {
        setError('Failed to load learning outcomes.');
      } finally {
        setIsLoadingOutcomes(false);
      }
    }, 2000),
    []
  );

  const fetchDisambiguationTags = useCallback(
    debounce(async (prompt, grade) => {
      if (!prompt || !grade) return;
      setIsLoadingTags(true);
      setError(null);
      try {
        const response = await getDisambiguationTags(prompt, grade);
        if (response.disambiguation_tags && Array.isArray(response.disambiguation_tags)) {
          setDisambiguationTags(response.disambiguation_tags.map(dt => ({ id: Date.now() + Math.random(), name: dt, selected: false })));
        } else {
          setDisambiguationTags([]);
          setError('Invalid disambiguation tags data received.');
        }
      } catch (err) {
        setError('Failed to load disambiguation tags.');
      } finally {
        setIsLoadingTags(false);
      }
    }, 2000),
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

  const toggleLearningOutcome = useCallback((outcome) => {
    setSelectedLearningOutcomes(prev =>
      prev.includes(outcome)
        ? prev.filter(o => o !== outcome)
        : [...prev, outcome]
    );
  }, []);

  const toggleDisambiguationTag = useCallback((tag) => {
    setSelectedDisambiguationTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const removeLearningOutcome = useCallback((outcome) => {
    setLearningOutcomes(prev => prev.filter(o => o.name !== outcome));
    setSelectedLearningOutcomes(prev => prev.filter(o => o !== outcome));
  }, []);

  const removeDisambiguationTag = useCallback((tag) => {
    setDisambiguationTags(prev => prev.filter(t => t.name !== tag));
    setSelectedDisambiguationTags(prev => prev.filter(t => t !== tag));
  }, []);

  const clearLearningOutcomes = () => {
    setLearningOutcomes([]);
    setSelectedLearningOutcomes([]);
  };

  const clearDisambiguationTags = () => {
    setDisambiguationTags([]);
    setSelectedDisambiguationTags([]);
  };

  const handleAddTag = () => {
    setIsAddingTag(true);
    setNewTag('');
  };

  const handleTagInput = (e) => {
    setNewTag(e.target.value);
  };

  const handleTagSubmit = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const newTagObj = {
        id: Date.now() + Math.random(),
        name: newTag.trim(),
        selected: true
      };
      setDisambiguationTags(prev => [...prev, newTagObj]);
      setSelectedDisambiguationTags(prev => [...prev, newTagObj.name]);
      setIsAddingTag(false);
      setNewTag('');
    }
  };

  const handleAddOutcome = () => {
    setIsAddingOutcome(true);
    setNewOutcome('');
  };

  const handleOutcomeInput = (e) => {
    setNewOutcome(e.target.value);
  };

  const handleOutcomeSubmit = (e) => {
    if (e.key === 'Enter' && newOutcome.trim()) {
      const newOutcomeObj = {
        id: Date.now() + Math.random(),
        name: newOutcome.trim(),
        selected: true
      };
      setLearningOutcomes(prev => [...prev, newOutcomeObj]);
      setSelectedLearningOutcomes(prev => [...prev, newOutcomeObj.name]);
      setIsAddingOutcome(false);
      setNewOutcome('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedDocument(file ? file.name : null);
  };

  const generateLessonPlan = () => {
    if (!topic || !gradeLevel) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    navigate('/lesson-plan', {
      state: {
        topic,
        gradeLevel,
        learningOutcomes: selectedLearningOutcomes,
        disambiguationTags: selectedDisambiguationTags,
        uploadedDocument
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50" style={{ zIndex: 9999 }} />
      <div
        className="fixed inset-0 flex items-center justify-center"
        role="dialog"
        aria-labelledby="lesson-plan-title"
        aria-modal="true"
        style={{ zIndex: 10000 }}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4" style={{ minHeight: '500px' }}>
          <div className="p-6 pb-2">
            <div className="flex items-center">
              <div className="text-[#0A58FF] text-2xl mr-3">✱</div>
              <h2 id="lesson-plan-title" className="text-[28px] font-semibold text-[#020105]">
                Create Lesson Plan
              </h2>
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-full hover:bg-[#F0F0F4] text-[#585D69]"
                aria-label="Close dialog"
              >
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
                      <Mic size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-[#585D69] text-lg mb-2">
                  Grade/Class <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-[#D2D2D2] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0A58FF] focus:border-transparent pr-10"
                  >
                    <option value="Pre-K">Pre-K</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#585D69]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 8l4 4 4-4H6z"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-[#585D69] text-lg mb-2">Attach</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-3 border border-[#D2D2D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A58FF] focus:border-transparent hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center px-4 py-3 border border-[#D2D2D2] rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <Paperclip size={20} className="mr-2" />
                      {uploadedDocument ? uploadedDocument : 'No file chosen'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[#585D69] text-lg">
                    Suggestions <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={clearLearningOutcomes}
                    className="text-[#585D69] text-sm hover:text-[#020105]"
                    aria-label="Clear all learning outcomes"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoadingOutcomes ? (
                    <div className="flex items-center space-x-2 bg-[#F5F5FA] px-4 py-2 rounded-full">
                      <svg
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#0A58FF"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="#0A58FF"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-[#585D69] text-sm font-roboto">Loading...</span>
                    </div>
                  ) : learningOutcomes.length > 0 || isAddingOutcome ? (
                    <>
                      {learningOutcomes.map((outcome, index) => (
                        <React.Fragment key={outcome.id}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleLearningOutcome(outcome.name);
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
                              selectedLearningOutcomes.includes(outcome.name)
                                ? 'bg-[#0A58FF] text-white border border-[#0A58FF]'
                                : 'bg-[#EEEEEE] text-[#585D69] border border-transparent'
                            }`}
                          >
                            <span className="flex-grow">{outcome.name}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeLearningOutcome(outcome.name);
                              }}
                              className="ml-2 text-[#585D69] hover:text-[#020105]"
                              aria-label={`Remove ${outcome.name}`}
                            >
                              <X size={14} />
                            </button>
                          </button>
                          {index === learningOutcomes.length - 1 && !isAddingOutcome && (
                            <button
                              onClick={handleAddOutcome}
                              className="px-2 py-2 rounded-full bg-gray-200 text-[#585D69] hover:bg-gray-300"
                              aria-label="Add new learning outcome"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      {isAddingOutcome && (
                        <input
                          type="text"
                          value={newOutcome}
                          onChange={handleOutcomeInput}
                          onKeyDown={handleOutcomeSubmit}
                          placeholder="Enter new outcome"
                          className="px-4 py-2 border border-[#D2D2D2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0A58FF]"
                          autoFocus
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-[#585D69] text-sm">{error || ''}</p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[#585D69] text-lg">
                    What's this about? <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={clearDisambiguationTags}
                    className="text-[#585D69] text-sm hover:text-[#020105]"
                    aria-label="Clear all disambiguation tags"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoadingTags ? (
                    <div className="flex items-center space-x-2 bg-[#F5F5FA] px-4 py-2 rounded-full">
                      <svg
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#0A58FF"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="#0A58FF"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-[#585D69] text-sm font-roboto">Loading...</span>
                    </div>
                  ) : disambiguationTags.length > 0 || isAddingTag ? (
                    <>
                      {disambiguationTags.map((tag, index) => (
                        <React.Fragment key={tag.id}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleDisambiguationTag(tag.name);
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center ${
                              selectedDisambiguationTags.includes(tag.name)
                                ? 'bg-[#0A58FF] text-white border border-[#0A58FF]'
                                : 'bg-[#EEEEEE] text-[#585D69] border border-transparent'
                            }`}
                          >
                            <span className="flex-grow">{tag.name}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeDisambiguationTag(tag.name);
                              }}
                              className="ml-2 text-[#585D69] hover:text-[#020105]"
                              aria-label={`Remove ${tag.name}`}
                            >
                              <X size={14} />
                            </button>
                          </button>
                          {index === disambiguationTags.length - 1 && !isAddingTag && (
                            <button
                              onClick={handleAddTag}
                              className="px-2 py-2 rounded-full bg-gray-200 text-[#585D69] hover:bg-gray-300"
                              aria-label="Add new disambiguation tag"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      {isAddingTag && (
                        <input
                          type="text"
                          value={newTag}
                          onChange={handleTagInput}
                          onKeyDown={handleTagSubmit}
                          placeholder="Enter new tag"
                          className="px-4 py-2 border border-[#D2D2D2] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0A58FF]"
                          autoFocus
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-[#585D69] text-sm">{error || ''}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={generateLessonPlan}
                  disabled={!topic || !gradeLevel}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    !topic || !gradeLevel
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#0A58FF] hover:bg-blue-600 text-white'
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4H4V7H7V4Z" fill="currentColor"/>
                    <path d="M7 9H4V12H7V9Z" fill="currentColor"/>
                    <path d="M4 14H7V17H4V14Z" fill="currentColor"/>
                    <path d="M9 4H12V7H9V4Z" fill="currentColor"/>
                    <path d="M12 9H9V12H12V9Z" fill="currentColor"/>
                    <path d="M9 14H12V17H9V14Z" fill="currentColor"/>
                    <path d="M14 4H17V7H14V4Z" fill="currentColor"/>
                    <path d="M17 9H14V12H17V9Z" fill="currentColor"/>
                    <path d="M14 14H17V17H14V14Z" fill="currentColor"/>
                  </svg>
                  <span className="font-medium">Generate</span>
                </button>
              </div>
              {error && <div className="p-4 mt-4 text-red-500">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonPlanDialog;