import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function Chat() {
  const { user } = useAuth()
  const { socket, emitTyping } = useSocket()
  const { userId } = useParams()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [chatPartner, setChatPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingUserId, setTypingUserId] = useState(null)
  const messagesEndRef = useRef(null)

  const otherUserId = useMemo(() => userId || selectedUser?.partner?._id, [userId, selectedUser])

  const partner = useMemo(() => selectedUser?.partner || chatPartner, [selectedUser, chatPartner])

  const fetchPartnerProfile = async (partnerId) => {
    try {
      const { data } = await api.get(`/users/profile/${partnerId}`)
      setChatPartner(data)
    } catch (error) {
      // ignore - partner profile is optional (chat still works)
    }
  }

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations

    const search = searchTerm.toLowerCase()
    return conversations.filter((conv) => {
      const name = `${conv.partner.profile?.firstName || ''} ${conv.partner.profile?.lastName || ''}`.toLowerCase()
      return name.includes(search)
    })
  }, [conversations, searchTerm])

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!userId) return

    const existing = conversations.find((c) => String(c.partner._id) === String(userId))
    if (existing) {
      setSelectedUser(existing)
    } else {
      setSelectedUser(null)
    }

    fetchPartnerProfile(userId)
    fetchMessages(userId)
  }, [userId, conversations])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message) => {
      const partnerId = String(message.sender._id) === String(user._id)
        ? message.recipient._id
        : message.sender._id

      if (String(partnerId) === String(otherUserId)) {
        setMessages((prev) => [...prev, message])
      }
      fetchConversations()
    }

    const handleTyping = ({ userId: typingId, isTyping }) => {
      setTypingUserId(isTyping ? typingId : null)
    }

    socket.on('new_message', handleNewMessage)
    socket.on('user_typing', handleTyping)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('user_typing', handleTyping)
    }
  }, [socket, otherUserId, user._id])

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations')
      setConversations(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load conversations')
    }
  }

  const fetchMessages = async (partnerId) => {
    if (!partnerId) return
    try {
      setLoading(true)
      const { data } = await api.get(`/messages/${partnerId}`)
      setMessages(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!messages.length) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSelectConversation = (conversation) => {
    setSelectedUser(conversation)
    setMessages([])
    navigate(`/chat/${conversation.partner._id}`)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!otherUserId || !messageText.trim()) return

    try {
      const { data } = await api.post('/messages', {
        recipientId: otherUserId,
        content: messageText.trim()
      })
      setMessages((prev) => [...prev, data])
      setMessageText('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send message')
    }
  }

  const handleTyping = (text) => {
    setMessageText(text)
    emitTyping(otherUserId, Boolean(text))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <button
                onClick={fetchConversations}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="input-field w-full text-sm"
            />
          </div>

          {filteredConversations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'No matching conversations.' : 'No conversations yet. Send a message to start one.'}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => {
                const isActive = selectedUser?.partner?._id === conversation.partner._id
                return (
                  <button
                    key={conversation.partner._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full rounded-lg p-3 text-left transition ${
                      isActive ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{conversation.partner.profile?.firstName} {conversation.partner.profile?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="rounded-full bg-primary-600 px-2 py-1 text-xs font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-lg border bg-card p-4">
          {!otherUserId ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-gray-600">Select a conversation to start chatting.</p>
              <Link to="/gigs" className="mt-3 text-primary-600 hover:text-primary-700">
                Browse gigs and connect with clients
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedUser?.partner?.profile?.firstName} {selectedUser?.partner?.profile?.lastName}
                  </h2>
                  {typingUserId === otherUserId && (
                    <p className="text-sm text-primary-600">Typing...</p>
                  )}
                </div>
                <button
                  onClick={() => navigate('/chat')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Back to conversations
                </button>
              </div>

              <div className="mb-4 h-[60vh] overflow-y-auto rounded-lg border bg-white p-4">
                {loading ? (
                  <p className="text-gray-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet. Say hello!</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isMine = String(message.sender._id) === String(user._id)
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                              isMine ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="mt-1 text-xs text-white/80">
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                        <div ref={messagesEndRef} />
