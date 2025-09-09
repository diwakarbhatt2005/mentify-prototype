import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import History from './components/History';
import MainContent from './components/MainContent';
import VoiceTextAgent from './components/VoiceTextAgent';

interface HistoryItem {
  id: string;
  timestamp: string;
  model: string;
  title: string;
  summary: string;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Mentify 1');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      timestamp: '2 hours ago',
      model: 'Mentify 1',
      title: 'Welcome conversation',
      summary: 'Initial setup and introduction to the platform features and capabilities.'
    },
    {
      id: '2',
      timestamp: '1 day ago',
      model: 'Mentify 2',
      title: 'Code assistance',
      summary: 'Help with React component development and TypeScript implementation.'
    },
    {
      id: '3',
      timestamp: '2 days ago',
      model: 'Mentuf 4',
      title: 'Creative writing',
      summary: 'Collaborative story writing session with character development.'
    }
  ]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewInteraction = (title: string, summary: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: 'Just now',
      model: selectedModel,
      title,
      summary
    };
    setHistory([newItem, ...history]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <History 
          isDarkMode={isDarkMode}
          history={history}
          onClearHistory={handleClearHistory}
        />
        
        <MainContent 
          isDarkMode={isDarkMode}
          selectedModel={selectedModel}
        />
      </div>

      <VoiceTextAgent 
        isDarkMode={isDarkMode}
        selectedModel={selectedModel}
        onNewInteraction={handleNewInteraction}
      />
    </div>
  );
}

export default App;