import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';

// Mock emoji picker
const EmojiPicker = ({ onSelect, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 10 }}
    className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-64 z-50"
  >
    <div className="grid grid-cols-8 gap-1">
      {['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '👏', '🙌', '💪', '🚀', '💡', '✨', '🌟'].map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  </motion.div>
);

export default function AnimatedChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! I saw your gig posting for the React developer position.', sender: 'them', time: '2:30 PM', read: true },
    { id: 2, text: 'Yes, are you interested in the role?', sender: 'me', time: '2:32 PM', read: true },
    { id: 3, text: 'Definitely! I have 3 years of experience with React and Node.js. I would love to discuss the project details.', sender: 'them', time: '2:33 PM', read: true },
    { id: 4, text: 'That sounds great! When are you available for a quick call?', sender: 'me', time: '2:35 PM', read: false },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const conversations = [
    { id: 1, name: 'John Doe', avatar: 'JD', online: true, lastMessage: 'That sounds great! When...', unread: 0 },
    { id: 2, name: 'Sarah Smith', avatar: 'SS', online: false, lastMessage: 'Thanks for the update!', unread: 2 },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', online: true, lastMessage: 'Can we discuss the budget?', unread: 0 },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
    setIsTyping(false);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: 'Perfect! How about tomorrow at 2 PM?',
            sender: 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          }
        ]);
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 relative">
      {/* Sidebar */}
      <div className={`w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col absolute lg:relative z-10 transition-transform duration-300 ${
        showMobileChat ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-100 text-blue-600 rounded-full"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto relative bg-white">
          {conversations.map((conv, index) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedConversation(index);
                setShowMobileChat(true);
              }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              className={`p-4 border-b border-gray-100 cursor-pointer flex items-center space-x-3 transition-colors ${
                selectedConversation === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">2m</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white absolute lg:relative inset-0 lg:inset-auto transition-transform duration-300 ${
        showMobileChat ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMobileChat(false)}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative">
              <div className="w-10 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {conversations[selectedConversation].avatar}
              </div>
              {conversations[selectedConversation].online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{conversations[selectedConversation].name}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Messages - Added relative positioning */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
          style={{ position: 'relative' }}
        >
          <div className="text-center sticky top-0 z-10">
            <span className="text-xs text-gray-400 bg-gray-200/80 backdrop-blur-sm px-3 py-1 rounded-full">Today</span>
          </div>
          
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] ${
                  message.sender === 'me' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900'
                } rounded-2xl px-4 py-3 shadow-sm`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    message.sender === 'me' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    <span className="text-xs">{message.time}</span>
                    {message.sender === 'me' && (
                      message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 relative z-20">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </motion.button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 min-w-0"
            />

            <div className="relative flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Smile className="h-5 w-5 text-gray-600" />
              </motion.button>
              
              <AnimatePresence>
                {showEmoji && (
                  <EmojiPicker 
                    onSelect={(emoji) => setInputText((prev) => prev + emoji)}
                    onClose={() => setShowEmoji(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
