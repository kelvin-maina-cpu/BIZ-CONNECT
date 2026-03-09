import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

// Emoji picker component
const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '👏', '🙌', '💪', '🚀', '💡', '✨', '🌟', '💯', '🎯', '💻', '☕'];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 w-64 z-50"
    >
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default function RealTimeChat() {
  const { userId: otherUserId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    socket, 
    joinConversation, 
    leaveConversation, 
    sendSocketMessage,
    emitTypingStart,
    emitTypingStop,
    markAsRead,
    isUserOnline,
    getTypingStatus,
    isConnected
  } = useSocket();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Join conversation when otherUserId changes
  useEffect(() => {
    if (otherUserId && socket) {
      joinConversation(otherUserId);
      fetchMessages(otherUserId);
      setSelectedConversation(conversations.find(c => c.partner._id === otherUserId));
      
      return () => {
        leaveConversation(otherUserId);
      };
    }
  }, [otherUserId, socket, joinConversation, leaveConversation, conversations]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages(prev => {
        // Prevent duplicates
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
      
      // Mark as read if we're the recipient
      if (message.recipient._id === user._id) {
        markAsRead(message._id, message.sender._id);
      }
    };

    const handleMessageRead = (data) => {
      setMessages(prev => prev.map(m => 
        m._id === data.messageId ? { ...m, read: true, readAt: new Date() } : m
      ));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, user, markAsRead]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (otherUserId) {
      emitTypingStart(otherUserId);
      
      // Clear existing timeout
      if (typingTimeout) clearTimeout(typingTimeout);
      
      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        emitTypingStop(otherUserId);
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !otherUserId || sending) return;
    
    setSending(true);
    const content = inputText.trim();
    setInputText('');
    
    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      content,
      sender: user,
      recipient: selectedConversation?.partner,
      createdAt: new Date().toISOString(),
      read: false,
      pending: true
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();
    
    // Try socket first, fallback to REST
    const sentViaSocket = sendSocketMessage(otherUserId, content);
    
    if (!sentViaSocket) {
      // Fallback to REST API
      try {
        const { data } = await api.post('/messages', {
          recipientId: otherUserId,
          content
        });
        
        // Replace optimistic message with real one
        setMessages(prev => prev.map(m => 
          m._id === tempId ? { ...data, pending: false } : m
        ));
      } catch (error) {
        // Mark as failed
        setMessages(prev => prev.map(m => 
          m._id === tempId ? { ...m, failed: true, pending: false } : m
        ));
        toast.error('Failed to send message');
      }
    } else {
      // Socket will emit back the confirmed message
      setMessages(prev => prev.map(m => 
        m._id === tempId ? { ...m, pending: false } : m
      ));
    }
    
    setSending(false);
    emitTypingStop(otherUserId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) => message.sender._id === user._id;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isConnected ? '🟢 Real-time connected' : '🔴 Offline mode'}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto relative">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start by applying to a gig!</p>
            </div>
          ) : (
            conversations.map((conv, index) => (
              <motion.div
                key={conv.partner._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/chat/${conv.partner._id}`)}
                className={`p-4 border-b border-gray-100 cursor-pointer flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                  otherUserId === conv.partner._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={conv.partner.profile?.avatar || '/default-avatar.png'} 
                    alt={`${conv.partner.profile?.firstName} ${conv.partner.profile?.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isUserOnline(conv.partner._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.partner.profile?.firstName} {conv.partner.profile?.lastName}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {otherUserId ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/chat')}
                  className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="relative">
                  <img 
                    src={selectedConversation?.partner.profile?.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isUserOnline(otherUserId) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation?.partner.profile?.firstName} {selectedConversation?.partner.profile?.lastName}
                  </h3>
                  <p className="text-sm text-green-600 flex items-center">
                    {getTypingStatus(otherUserId) ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        typing...
                      </>
                    ) : isUserOnline(otherUserId) ? (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        Online
                      </>
                    ) : (
                      <span className="text-gray-400">Offline</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="h-5 w-5 text-gray-600" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <span className="text-xs text-gray-400 bg-gray-200/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => {
                      const own = isOwnMessage(message);
                      const showAvatar = index === 0 || 
                        messages[index - 1].sender._id !== message.sender._id;
                      
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`flex ${own ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end space-x-2 max-w-[80%] ${own ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {!own && showAvatar && (
                              <img 
                                src={message.sender.profile?.avatar || '/default-avatar.png'}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                            )}
                            {!own && !showAvatar && <div className="w-8" />}
                            
                            <div className={`px-4 py-2 rounded-2xl ${
                              own 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                            } ${message.pending ? 'opacity-70' : ''} ${message.failed ? 'bg-red-100 text-red-900' : ''}`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                own ? 'text-blue-200' : 'text-gray-400'
                              }`}>
                                <span className="text-xs">{formatTime(message.createdAt)}</span>
                                {own && (
                                  message.pending ? (
                                    <Clock className="h-3 w-3" />
                                  ) : message.failed ? (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                  ) : message.read ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} className="h-1" />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2 bg-gray-100 rounded-2xl px-4 py-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </motion.button>

                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full bg-transparent border-none focus:outline-none resize-none py-2 text-gray-900 placeholder-gray-500 max-h-32"
                    style={{ minHeight: '24px' }}
                  />
                </div>

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
                        onSelect={(emoji) => setInputText(prev => prev + emoji)}
                        onClose={() => setShowEmoji(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputText.trim() || sending}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                Press Enter to send, Shift + Enter for new line • {isConnected ? 'Real-time' : 'REST API'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg mb-2">Select a conversation</p>
              <p className="text-sm">Choose someone from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
