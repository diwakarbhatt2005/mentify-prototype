import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User, Copy, RefreshCw, Plus, Paperclip, ArrowUp, ChevronDown, Lock, Check, Zap, Brain, Sparkles, X, FileText, Image as ImageIcon, File } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  attachment?: {
    file: File;
    type: 'image' | 'document' | 'other';
    preview?: string;
  };
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

interface ChatInterfaceProps {
  isDarkMode: boolean;
  selectedModel: string;
  onNewInteraction: (title: string, summary: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isDarkMode, selectedModel, onNewInteraction }) => {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<Buddy | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    type: 'image' | 'document' | 'other';
    preview?: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [suggestions] = useState([
    "Help me write an email",
    "Explain this concept",
    "Create a summary",
    "Generate ideas"
  ]);
  
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setIsModelSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text') ? 'document' : 'other';
    
    const attachment = {
      file,
      type: fileType as 'image' | 'document' | 'other'
    };

    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedFile({
          ...attachment,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedFile(attachment);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove attachment
  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const handleModelSelect = (buddy: Buddy) => {
    if (buddy.isLocked) {
      setShowUpgradeModal(buddy);
    } else {
      onNewInteraction(`Switched to ${buddy.name}`, `Changed AI model to ${buddy.name}`);
      setIsModelSelectorOpen(false);
    }
  };

  const handleUpgradeModalClose = () => {
    setShowUpgradeModal(null);
    setIsModelSelectorOpen(false);
  };

  const handleUpgrade = () => {
    alert(`Redirecting to upgrade ${showUpgradeModal?.name} for ${showUpgradeModal?.price}`);
    handleUpgradeModalClose();
  };

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
      isVoice: isListening,
      attachment: attachedFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      <div className={`flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b relative ${
        isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
      } h-[57px] sm:h-[73px]`}>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            <Bot className="text-white" size={14} />
          </div>
          <div className="relative" ref={modelSelectorRef}>
            <button
              onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <h2 className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedModel}
                </h2>
                <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs">
                    Online
                  </span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${isModelSelectorOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                />
              </div>
            </button>

            {/* Model Selector Dropdown */}
            {isModelSelectorOpen && (
              <div className={`absolute top-full left-0 mt-2 w-80 rounded-xl border shadow-xl backdrop-blur-xl z-50 overflow-hidden ${
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
                        onClick={() => handleModelSelect(buddy)}
                        className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                          isDarkMode 
                            ? 'hover:bg-gray-700/80' 
                            : 'hover:bg-gray-50/80'
                        } ${isSelected ? (isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50/80') : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-white'
                            }`}>
                              {buddy.isLocked ? (
                                <Lock size={14} className="text-gray-400" />
                              ) : (
                                <IconComponent size={14} className={buddy.color} />
                              )}
                            </div>
                            <div className="flex-1">
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
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {buddy.price}
                            </div>
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
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={startNewChat}
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${
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
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="New Chat"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Clear Chat"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Lock size={24} className="text-gray-400" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Upgrade to {showUpgradeModal.name}
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {showUpgradeModal.description}
              </p>
              <div className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {showUpgradeModal.price}/month
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUpgradeModalClose}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto transition-all duration-200 ${
          isDragOver 
            ? isDarkMode 
              ? 'bg-blue-900/20 border-2 border-dashed border-blue-500' 
              : 'bg-blue-50/50 border-2 border-dashed border-blue-400'
            : isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className={`text-center p-4 rounded-xl ${
              isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'
            }`}>
              <Paperclip size={32} className="mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold mb-1">Drop file here</h3>
              <p className="text-xs opacity-70">Release to attach</p>
            </div>
          </div>
        )}
        
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-end h-full p-4 sm:p-6 lg:p-8 text-center pb-8">
            <h1 className={`text-lg sm:text-xl font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How can I help you today?
            </h1>
            <p className={`text-sm mb-4 text-center max-w-xl px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              I'm {selectedModel}, your AI assistant. I can help with writing, analysis, coding, creative tasks, and much more. 
            </p>
          </div>
        ) : (
          // Chat Messages
          <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center">
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                <div className={`flex items-start space-x-3 sm:space-x-4 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {msg.type === 'bot' && (
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-6 ${
                      isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <Bot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={14} />
                    </div>
                  )}
                  
                  <div className={`flex-1 min-w-0 ${msg.type === 'user' ? 'max-w-[75%] flex flex-col items-end' : 'max-w-[75%]'}`}>
                    <div className={`flex items-center mb-1 space-x-2 ${msg.type === 'user' ? 'justify-end' : ''}`} style={{ height: '1.25rem' }}>
                      <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {msg.type === 'user' ? 'You' : selectedModel}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    
                    <div className={`inline-block px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md max-w-fit !outline-none !border-none !shadow-none !ring-0'
                        : isDarkMode 
                          ? 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700' 
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                    }`}>
                      {msg.attachment && (
                        <div className="mb-2">
                          {msg.attachment.type === 'image' && msg.attachment.preview ? (
                            <img 
                              src={msg.attachment.preview} 
                              alt="Attachment" 
                              className="max-w-xs max-h-48 rounded-lg object-cover"
                            />
                          ) : (
                            <div className={`flex items-center space-x-2 p-2 rounded-lg ${
                              msg.type === 'user' ? 'bg-white/20' : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {React.createElement(getFileIcon(msg.attachment.type), { 
                                size: 16, 
                                className: msg.type === 'user' ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-600' 
                              })}
                              <span className={`text-sm ${
                                msg.type === 'user' ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {msg.attachment.file.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
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
                    <div className={`flex items-center space-x-1 sm:space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className={`p-1.5 sm:p-1 rounded transition-colors duration-200 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center ${
                          isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                        }`}
                        title="Copy message"
                      >
                        <Copy size={12} className="sm:w-[14px] sm:h-[14px]" />
                      </button>
                      {msg.type === 'bot' && (
                        <button
                          onClick={() => toggleSpeaking(msg.content)}
                          className={`p-1.5 sm:p-1 rounded transition-colors duration-200 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center ${
                            isSpeaking 
                              ? 'bg-green-500 text-white' 
                              : isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                          title="Read aloud"
                        >
                          {isSpeaking ? <VolumeX size={12} className="sm:w-[14px] sm:h-[14px]" /> : <Volume2 size={12} className="sm:w-[14px] sm:h-[14px]" />}
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
                <div className="flex items-start space-x-2 sm:space-x-4">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <Bot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={12} />
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center space-x-1 sm:space-x-2 mb-2`}>
                      <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
        {/* Suggestions */}
        {messages.length === 0 && (
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 pt-2">
            <div className="flex justify-end gap-2 mb-2">
              {suggestions.slice(0, 2).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto p-2 sm:p-3 lg:p-4 pb-safe">
          {/* File attachment preview */}
          {attachedFile && (
            <div className={`mb-2 p-2 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {attachedFile.type === 'image' && attachedFile.preview ? (
                    <img 
                      src={attachedFile.preview} 
                      alt="Preview" 
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {React.createElement(getFileIcon(attachedFile.type), { 
                        size: 16, 
                        className: isDarkMode ? 'text-gray-300' : 'text-gray-600' 
                      })}
                    </div>
                  )}
                  <div>
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {attachedFile.file.name}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {(attachedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeAttachment}
                  className={`p-1 rounded transition-colors duration-200 ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'
                  }`}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
          
          <div className="relative flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <div className={`flex items-center space-x-2 flex-1 px-3 py-2 rounded-xl border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <button 
                onClick={handleFileInputClick}
                className={`hidden sm:block p-1.5 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>
              <button
                onClick={handleFileInputClick}
                className={`sm:hidden p-1.5 rounded-lg transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                title="Attach file"
              >
                <Paperclip size={16} />
              </button>
              
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 bg-transparent border-none outline-none resize-none max-h-20 py-1 text-sm focus:outline-none focus:ring-0 focus:border-transparent ${
                  isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                }`}
                rows={1}
                maxLength={2000}
                disabled={isTyping}
              />
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleListening}
                  className={`p-1.5 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className={`p-1.5 rounded-lg transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
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
                  <ArrowUp size={16} />
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