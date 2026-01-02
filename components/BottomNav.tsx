
import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
  return (
    <nav className="flex border-t border-[#283039] bg-[#1c2127] pt-2 pb-6 px-6">
      <NavLink 
        to="/home" 
        className={({ isActive }) => 
          `flex-1 flex flex-col items-center justify-end gap-1 transition-colors ${isActive ? 'text-primary' : 'text-[#9dabb9]'}`
        }
      >
        <span className="material-symbols-outlined text-[24px]">home</span>
        <span className="text-xs font-medium">Home</span>
      </NavLink>
      <NavLink 
        to="/aspireAI" 
        className={({ isActive }) => 
          `flex-1 flex flex-col items-center justify-end gap-1 transition-colors ${isActive ? 'text-primary' : 'text-[#9dabb9]'}`
        }
      >
        <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
        <span className="text-xs font-medium">aspireAI</span>
      </NavLink>
      <NavLink 
        to="/settings" 
        className={({ isActive }) => 
          `flex-1 flex flex-col items-center justify-end gap-1 transition-colors ${isActive ? 'text-primary' : 'text-[#9dabb9]'}`
        }
      >
        <span className="material-symbols-outlined text-[24px]">settings</span>
        <span className="text-xs font-medium">Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
