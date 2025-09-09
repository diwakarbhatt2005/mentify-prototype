import React from 'react';
import { Brain, Zap, Shield, Globe } from 'lucide-react';

interface MainContentProps {
  isDarkMode: boolean;
  selectedModel: string;
}

const MainContent: React.FC<MainContentProps> = ({ isDarkMode, selectedModel }) => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Access cutting-edge AI models designed for various tasks and applications.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get instant responses with our optimized infrastructure and processing power.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Available worldwide with multi-language support and localized experiences.'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Mentify
            </span>
          </h1>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience the future of AI interaction with our advanced models
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Currently using: {selectedModel}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <feature.icon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Getting Started Section */}
        <div className={`p-8 rounded-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Getting Started
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                1
              </div>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Select Model
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose from our available AI models
              </p>
            </div>
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                2
              </div>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Start Chatting
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Use voice or text to interact
              </p>
            </div>
            <div className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 ${
                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                3
              </div>
              <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                View History
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your conversations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;