import React from 'react';
import { useState } from 'react';
import { Clock, Trash2, Download } from 'lucide-react';

interface HistoryItem {
  id: string;
  timestamp: string;
  model: string;
  title: string;
  summary: string;
}

interface HistoryProps {
  isDarkMode: boolean;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ isDarkMode, history, onClearHistory }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile History Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isMobileOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300 flex flex-col`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} h-[57px] sm:h-[73px] flex items-center`}>
            <div className="flex items-center justify-between w-full">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                History
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={onClearHistory}
                  className={`p-1.5 rounded-md transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Clear History"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className={`p-1.5 rounded-md transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {history.length === 0 ? (
              <div className="p-4 text-center">
                <Clock className={`mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} size={24} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No history yet
                </p>
              </div>
            ) : (
              <div className="p-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-800 border border-gray-700' 
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.model}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.timestamp}
                      </span>
                    </div>
                    <h3 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop History Sidebar */}
      <div className={`w-80 h-full ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300 flex flex-col hidden lg:flex`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} h-[73px] flex items-center`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            History
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={onClearHistory}
              className={`p-1.5 rounded-md transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Clear History"
            >
              <Trash2 size={16} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Export History"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="p-4 text-center">
            <Clock className={`mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} size={24} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No history yet
            </p>
          </div>
        ) : (
          <div className="p-2">
            {history.map((item) => (
              <div
                key={item.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-gray-800 border border-gray-700' 
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.model}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.timestamp}
                  </span>
                </div>
                <h3 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Mobile History Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`lg:hidden fixed bottom-20 left-4 z-40 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
          isDarkMode ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-900 border border-gray-200'
        }`}
        title="Open History"
      >
        <Clock size={20} />
      </button>
    </>
  );
};

export default History;