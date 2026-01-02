
import React from 'react';
import { ENTERPRISE_TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2 bg-background-dark sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-[#3b4754]" 
            style={{ backgroundImage: 'url("https://picsum.photos/seed/alex/100/100")' }}
          />
          <div className="flex flex-col">
            <h2 className="text-white text-lg font-bold leading-tight">Good morning, Alex</h2>
            <p className="text-[#9dabb9] text-sm font-medium">Senior Broker</p>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 hover:bg-[#283039] transition-colors relative">
          <span className="material-symbols-outlined text-white text-2xl">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-background-dark"></span>
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4">
        <div className="pt-4 pb-3">
          <h1 className="text-white text-[22px] font-bold leading-tight tracking-tight">Enterprise Tools</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ENTERPRISE_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
