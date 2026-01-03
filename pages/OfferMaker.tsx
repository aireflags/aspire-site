
import React from 'react';

const OfferMaker: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2 bg-white sticky top-0 z-10 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-gray-200" 
            style={{ backgroundImage: 'url("https://picsum.photos/seed/alex/100/100")' }}
          />
          <div className="flex flex-col">
            <h2 className="text-gray-900 text-lg font-bold leading-tight">Good morning, Liz</h2>
            <p className="text-gray-500 text-sm font-medium">Newbie Agent</p>
          </div>
        </div>
        <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-100 transition-colors relative">
          <span className="material-symbols-outlined text-gray-900 text-2xl">notifications</span>
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-4">
              <span className="material-symbols-outlined text-primary text-4xl">chat_bubble</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Offer Maker</h1>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default OfferMaker;

