
import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asset Portfolio</h1>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#1c2127] border border-[#3b4754]">
          <p className="text-[#9dabb9] text-sm">Total Assets Under Management</p>
          <p className="text-3xl font-bold text-white mt-1">$14.2M</p>
          <div className="mt-4 h-2 bg-[#283039] rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500 w-[60%]"></div>
            <div className="h-full bg-cyan-500 w-[25%]"></div>
            <div className="h-full bg-indigo-500 w-[15%]"></div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#1c2127] border border-[#3b4754]">
          <h3 className="font-bold mb-3">Recent Performance</h3>
          <div className="space-y-3">
            {[
              { label: 'S&P 500 Index', value: '+1.2%', up: true },
              { label: 'Growth Fund A', value: '-0.4%', up: false },
              { label: 'International Bond', value: '+0.1%', up: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-[#9dabb9]">{item.label}</span>
                <span className={item.up ? 'text-green-500' : 'text-red-500'}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
