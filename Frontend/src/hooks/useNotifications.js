import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

export function useNotifications({ enabled } = { enabled: false }) {
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingApplications, setPendingApplications] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCounts = async () => {
    if (!enabled) return
    try {
      setLoading(true)
      setError(null)

      const [messagesRes, appsRes] = await Promise.all([
        api.get('/messages/conversations'),
        api.get('/applications/my-applications')
      ])

      const totalUnread = (messagesRes.data || []).reduce(
        (sum, convo) => sum + (convo.unreadCount || 0),
        0
      )

      const pending = (appsRes.data || []).filter((app) => app.status === 'pending').length

      setUnreadMessages(totalUnread)
      setPendingApplications(pending)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [enabled])

  const hasNotifications = useMemo(
    () => unreadMessages > 0 || pendingApplications > 0,
    [unreadMessages, pendingApplications]
  )

  return {
    unreadMessages,
    pendingApplications,
    loading,
    error,
    hasNotifications,
    refresh: fetchCounts
  }
}
