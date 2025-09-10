import React from 'react';
import { User, LogOut, Sun, Moon, Lock, Bot, Zap, Brain, Sparkles } from 'lucide-react';
import logo from "/logo-mentify.jpg";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

interface Buddy {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  isLocked: boolean;
  price?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, selectedModel, setSelectedModel }) => {
  const buddies: Buddy[] = [
    { id: 'mentify-1', name: 'Mentify 1', icon: Bot, isLocked: false },
    { id: 'mentify-2', name: 'Mentify 2', icon: Zap, isLocked: false },
    { id: 'mentify-3', name: 'Mentify 3', icon: Brain, isLocked: true, price: '$9.99' },
    { id: 'mentify-4', name: 'Mentify 4', icon: Sparkles, isLocked: true, price: '$14.99' },
  ];

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b transition-colors duration-300`}>
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <img 
                  src={logo} 
                  alt="Mentify Logo" 
                  className="w-8 h-8 rounded-md object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div className={`w-8 h-8 rounded-md ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white font-bold text-sm hidden`}>
                  M
                </div>
              </div>
            </div>
            <div className="ml-3">
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mentify
              </h1>
            </div>
          </div>

          {/* Model Selection Dropdown */}
          <div className="flex-1 max-w-sm mx-8">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}
              >
                {buddies.map((buddy) => (
                  <option 
                    key={buddy.id} 
                    value={buddy.name}
                    disabled={buddy.isLocked}
                  >
                    {buddy.name} {buddy.isLocked ? '🔒' : ''}
                  </option>
                ))}
              </select>
              
              {/* Custom dropdown content for better styling */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {(() => {
                  const currentBuddy = buddies.find(b => b.name === selectedModel);
                  if (currentBuddy) {
                    const IconComponent = currentBuddy.icon;
                    return <IconComponent size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />;
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <User size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Logout */}
            <button className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;