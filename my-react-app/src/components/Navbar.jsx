import React from 'react';
import { Bell } from 'lucide-react';
import CreateDropdown from './CreateDropdown';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#D2D2D2] flex items-center justify-between px-6 z-50">
      <div className="flex items-center">
        {/* Text-based logo */}
        <div className="text-xl font-bold text-[#0A58FF]">
          7<span className="text-[#020105]">Seers</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Create Button with Dropdown */}
        <CreateDropdown />
        
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-[#F0F0F4] transition-colors">
            <Bell size={20} className="text-[#585D69]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#0A58FF] rounded-full"></span>
          </button>
        </div>
        
        {/* Profile Badge */}
        <div className="flex items-center">
          <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-[#F0F0F4] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#0A58FF] text-white flex items-center justify-center font-medium">
              JS
            </div>
            <span className="text-sm font-medium text-[#020105]">John Smith</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;