import React from 'react';
import { Home, LayoutGrid, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Tools', icon: LayoutGrid, path: '/tools' },
    { name: 'Recent', icon: Clock, path: '/recent' }
  ];

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#FFFFFF] border-r border-[#D2D2D2] z-10">
      <div className="py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#020105] hover:bg-[#F0F0F4] transition-colors"
              >
                <item.icon size={20} className="text-[#585D69]" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;