import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

interface VoiceTextAgentProps {
  isDarkMode: boolean;
  selectedModel: string;
  onNewInteraction: (title: string, summary: string) => void;
}

const VoiceTextAgent: React.FC<VoiceTextAgentProps> = ({ isDarkMode, selectedModel, onNewInteraction }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would implement actual speech recognition
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setMessage("Hello, I'm speaking to you...");
        setIsListening(false);
      }, 2000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Here you would implement text-to-speech
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add to history
      onNewInteraction(
        message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        `Interaction with ${selectedModel}: ${message}`
      );
      
      // Clear message
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Interface */}
      {isExpanded && (
        <div className={`mb-4 w-80 rounded-2xl shadow-2xl transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Chat with {selectedModel}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice input..."
                className={`w-full p-3 pr-12 rounded-lg border resize-none transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                rows={3}
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`absolute bottom-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                  message.trim()
                    ? isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                
                <button
                  onClick={toggleSpeaking}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isSpeaking
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
              
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {message.length}/500
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } ${isExpanded ? 'rotate-45' : ''}`}
      >
        {isExpanded ? (
          <div className="flex items-center justify-center">✕</div>
        ) : (
          <div className="flex items-center justify-center">
            <Mic size={20} />
          </div>
        )}
      </button>
    </div>
  );
};

export default VoiceTextAgent;