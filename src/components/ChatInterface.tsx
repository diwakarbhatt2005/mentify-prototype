import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User, Copy, RefreshCw, Plus, Paperclip, ArrowUp } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface ChatInterfaceProps {
  isDarkMode: boolean;
  selectedModel: string;
  onNewInteraction: (title: string, summary: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isDarkMode, selectedModel, onNewInteraction }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleSpeaking = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      `I understand you're asking about "${userMessage}". Let me help you with that.`,
      `That's an interesting question about "${userMessage}". Here's what I think...`,
      `Based on your message about "${userMessage}", I can provide some insights.`,
      `Thank you for sharing that. Regarding "${userMessage}", here's my response...`,
      `I see you mentioned "${userMessage}". Let me elaborate on that topic.`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse} This is a simulated response from ${selectedModel}. In a real implementation, this would connect to an actual AI model to provide meaningful responses based on your input.`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
      isVoice: isListening
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Add to history
    onNewInteraction(
      message.slice(0, 50) + (message.length > 50 ? '...' : ''),
      `Chat with ${selectedModel}: ${message}`
    );

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(userMessage.content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
      } h-[73px]`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <Bot className="text-white" size={18} />
          </div>
          <div>
            <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedModel}
            </h2>
            <div className={`flex items-center space-x-1`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={startNewChat}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <Plus size={16} />
            <span className="text-sm">New Chat</span>
          </button>
          <button
            onClick={startNewChat}
            className={`sm:hidden p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="New Chat"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Clear Chat"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

            <h1 className={`text-2xl sm:text-3xl font-bold mb-4 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How can I help you today?
            </h1>
            <p className={`text-base sm:text-lg mb-8 text-center max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              I'm {selectedModel}, your AI assistant. I can help with writing, analysis, coding, creative tasks, and much more. 
              You can type your message or use voice input.
            </p>
            
            {/* Suggested Prompts */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl w-full">
              {[
                {
                  title: "Help me write an essay",
                  description: "About AI chat applications",
                  prompt: "Help me write an essay about AI chat applications"
                },
                {
                  title: "Explain a concept",
                  description: "Make complex topics simple",
                  prompt: "Explain quantum computing in simple terms"
                },
                {
                  title: "Code assistance",
                  description: "Debug or write code",
                  prompt: "Help me create a React component"
                },
                {
                  title: "Creative writing",
                  description: "Stories, poems, or scripts",
                  prompt: "Write a short story about time travel"
                }
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion.prompt)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {suggestion.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {suggestion.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat Messages
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 flex-1 flex flex-col justify-center">
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                <div className={`flex items-start space-x-4 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' 
                      ? isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="text-white" size={16} />
                    ) : (
                      <Bot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={16} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center space-x-2 mb-1 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {msg.type === 'user' ? 'You' : selectedModel}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    
                    <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                      msg.type === 'user'
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-800 text-gray-100' 
                          : 'bg-gray-100 text-gray-900'
                    } ${msg.type === 'user' ? 'rounded-br-md ml-auto' : 'rounded-bl-md'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                    
                    {msg.isVoice && (
                      <div className={`flex items-center mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Mic size={12} className="mr-1" />
                        Voice message
                      </div>
                    )}
                    
                    {/* Message Actions */}
                    <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                        }`}
                        title="Copy message"
                      >
                        <Copy size={14} />
                      </button>
                      {msg.type === 'bot' && (
                        <button
                          onClick={() => toggleSpeaking(msg.content)}
                          className={`p-1 rounded transition-colors duration-200 ${
                            isSpeaking 
                              ? 'bg-green-500 text-white' 
                              : isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                          title="Read aloud"
                        >
                          {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="group">
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <Bot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center space-x-2 mb-2`}>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedModel}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="relative flex items-center">
            <div className={`flex items-center space-x-2 sm:space-x-3 flex-1 px-3 sm:px-4 py-3 rounded-2xl border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 focus-within:border-gray-500' 
                : 'bg-gray-50 border-gray-300 focus-within:border-gray-400'
            }`}>
              <button className={`hidden sm:block p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                title="Attach file"
              >
                <Paperclip size={16} className="sm:hidden" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none max-h-32 py-1 ${
                  isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
                rows={1}
                maxLength={2000}
                disabled={isTyping}
              />
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    message.trim() && !isTyping
                      ? isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <ArrowUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;