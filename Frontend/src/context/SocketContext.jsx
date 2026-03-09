import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [unreadCounts, setUnreadCounts] = useState(new Map());
  const { user, isAuthenticated } = useAuth();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('🔌 Socket connected:', newSocket.id);
        reconnectAttempts.current = 0;
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reconnectAttempts.current++;
        
        if (reconnectAttempts.current >= maxReconnectAttempts) {
          toast.error('Unable to connect to real-time server. Messages may be delayed.');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      // User presence
      newSocket.on('user_online', (data) => {
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      });

      newSocket.on('user_offline', (data) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      // Typing indicators
      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          if (data.isTyping) {
            newMap.set(data.userId, data.name);
          } else {
            newMap.delete(data.userId);
          }
          return newMap;
        });
      });

      // Notifications
      newSocket.on('new_notification', (data) => {
        if (data.type === 'message') {
          toast.success(`New message from ${data.sender.name}`, {
            icon: '💬',
            duration: 3000
          });
        }
      });

      // Unread counts
      newSocket.on('unread_count_update', (data) => {
        setUnreadCounts(prev => {
          const newMap = new Map(prev);
          newMap.set(data.senderId, data.count);
          return newMap;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Join conversation room
  const joinConversation = useCallback((otherUserId) => {
    if (socket) {
      socket.emit('join_conversation', { otherUserId });
    }
  }, [socket]);

  // Leave conversation room
  const leaveConversation = useCallback((otherUserId) => {
    if (socket) {
      socket.emit('leave_conversation', { otherUserId });
    }
  }, [socket]);

  // Send message via socket
  const sendSocketMessage = useCallback((recipientId, content, gigId = null) => {
    if (socket) {
      socket.emit('send_message', { recipientId, content, gigId });
      return true;
    }
    return false;
  }, [socket]);

  // Emit typing start
  const emitTypingStart = useCallback((recipientId) => {
    if (socket) {
      socket.emit('typing_start', { recipientId });
    }
  }, [socket]);

  // Emit typing stop
  const emitTypingStop = useCallback((recipientId) => {
    if (socket) {
      socket.emit('typing_stop', { recipientId });
    }
  }, [socket]);

  // Mark message as read
  const markAsRead = useCallback((messageId, senderId) => {
    if (socket) {
      socket.emit('mark_read', { messageId, senderId });
    }
  }, [socket]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Get typing status
  const getTypingStatus = useCallback((userId) => {
    return typingUsers.get(userId);
  }, [typingUsers]);

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    unreadCounts,
    joinConversation,
    leaveConversation,
    sendSocketMessage,
    emitTypingStart,
    emitTypingStop,
    markAsRead,
    isUserOnline,
    getTypingStatus,
    isConnected: !!socket?.connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
