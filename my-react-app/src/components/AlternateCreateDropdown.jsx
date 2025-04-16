import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText, Layout, BookOpen } from 'lucide-react';
import AlternateLessonPlanDialog from './AlternateLessonPlanDialog';

const AlternateCreateDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLessonPlanOpen, setIsLessonPlanOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tools for alternate functionality
  const alternateTools = [
    { name: 'Module', icon: FileText, action: () => console.log('Advanced Module selected') },
    { name: 'Presentation', icon: Layout, action: () => console.log('Interactive Presentation selected') },
    { name: 'Document', icon: BookOpen, action: () => setIsLessonPlanOpen(true) },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={toggleDropdown}
          className="flex items-center justify-center gap-2 bg-[#0A58FF] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium">Create</span>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#D2D2D2] py-2 z-20">
            {alternateTools.map((tool, index) => (
              <button 
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  tool.action();
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F0F4] transition-colors w-full text-left"
              >
                <tool.icon size={18} className="text-[#585D69]" />
                <span className="text-[#020105] text-sm font-medium">{tool.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Alternate Lesson Plan Dialog */}
      <AlternateLessonPlanDialog 
        isOpen={isLessonPlanOpen} 
        onClose={() => setIsLessonPlanOpen(false)} 
      />
    </>
  );
};

export default AlternateCreateDropdown;