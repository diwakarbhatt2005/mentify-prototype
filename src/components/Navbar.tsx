import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sun, Moon, Lock, Bot, Zap, Brain, Sparkles, ChevronDown, Check } from 'lucide-react';
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
  description: string;
  color: string;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, selectedModel, setSelectedModel }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const buddies: Buddy[] = [
    { 
      id: 'mentify-1', 
      name: 'Mentify 1', 
      icon: Bot, 
      isLocked: false, 
      description: 'General purpose AI assistant',
      color: 'text-blue-500'
    },
    { 
      id: 'mentify-2', 
      name: 'Mentify 2', 
      icon: Zap, 
      isLocked: false, 
      description: 'Fast and efficient responses',
      color: 'text-yellow-500'
    },
    { 
      id: 'mentify-3', 
      name: 'Mentify 3', 
      icon: Brain, 
      isLocked: true, 
      price: '$9.99', 
      description: 'Advanced reasoning and analysis',
      color: 'text-purple-500'
    },
    { 
      id: 'mentify-4', 
      name: 'Mentify 4', 
      icon: Sparkles, 
      isLocked: true, 
      price: '$14.99', 
      description: 'Creative and innovative solutions',
      color: 'text-pink-500'
    },
  ];

  const currentBuddy = buddies.find(b => b.name === selectedModel) || buddies[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBuddySelect = (buddy: Buddy) => {
    if (!buddy.isLocked) {
      setSelectedModel(buddy.name);
      setIsDropdownOpen(false);
    }
  };

  const handleUnlockBuddy = (buddy: Buddy, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would open a payment modal
    alert(`Unlock ${buddy.name} for ${buddy.price}?`);
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-900/95 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} border-b backdrop-blur-xl transition-all duration-300 sticky top-0 z-50`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105 overflow-hidden">
                <img 
                  src={logo} 
                  alt="Mentify Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-sm hidden ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'}`}>
                  M
                </div>
              </div>
            </div>
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r ${isDarkMode ? 'from-white to-gray-300' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                Mentify
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                AI Platform
              </p>
            </div>
          </div>

          {/* Enhanced Model Selection Dropdown */}
          <div className="flex-1 max-w-sm mx-4 lg:mx-8" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700/80 hover:border-gray-500' 
                    : 'bg-white/80 border-gray-300 text-gray-900 hover:bg-gray-50/80 hover:border-gray-400'
                } ${isDropdownOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <currentBuddy.icon size={16} className={currentBuddy.color} />
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="font-semibold text-sm">{currentBuddy.name}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentBuddy.description}
                      </div>
                    </div>
                    <div className="text-left sm:hidden">
                      <div className="font-semibold text-sm">{currentBuddy.name}</div>
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                  />
                </div>
              </button>
              
              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl backdrop-blur-xl z-50 overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-800/95 border-gray-600' 
                    : 'bg-white/95 border-gray-200'
                }`}>
                  <div className="p-2">
                    {buddies.map((buddy) => {
                      const IconComponent = buddy.icon;
                      const isSelected = buddy.name === selectedModel;
                      
                      return (
                        <div
                          key={buddy.id}
                          onClick={() => handleBuddySelect(buddy)}
                          className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                            buddy.isLocked 
                              ? isDarkMode ? 'opacity-60 hover:opacity-80' : 'opacity-60 hover:opacity-80'
                              : isDarkMode 
                                ? 'hover:bg-gray-700/80' 
                                : 'hover:bg-gray-50/80'
                          } ${isSelected && !buddy.isLocked ? (isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50/80') : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                buddy.isLocked 
                                  ? isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                                  : isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-white'
                              }`}>
                                {buddy.isLocked ? (
                                  <Lock size={14} className="text-gray-400" />
                                ) : (
                                  <IconComponent size={14} className={buddy.color} />
                                )}
                              </div>
                              <div>
                                <div className={`font-semibold text-sm flex items-center space-x-2 ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  <span>{buddy.name}</span>
                                  {isSelected && !buddy.isLocked && (
                                    <Check size={12} className="text-blue-500" />
                                  )}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {buddy.description}
                                </div>
                              </div>
                            </div>
                            
                            {buddy.isLocked && (
                              <button
                                onClick={(e) => handleUnlockBuddy(buddy, e)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                  isDarkMode 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                } shadow-md hover:shadow-lg`}
                              >
                                Unlock {buddy.price}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation Items */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Profile */}
            <button className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/80' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}>
              <User size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/80' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Logout */}
            <button className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800/80' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;