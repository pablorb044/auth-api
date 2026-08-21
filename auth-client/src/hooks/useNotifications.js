import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notification.api'

const POLLING_INTERVAL = 30000

export function useNotifications() {
  const { user } = useAuth()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setError('')

      const [notificationsData, unreadData] =
        await Promise.all([
          getNotifications(),
          getUnreadNotificationCount()
        ])

      setNotifications(notificationsData)
      setUnreadCount(unreadData.count)
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al cargar las notificaciones'
      )
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        setNotifications([])
        setUnreadCount(0)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const [
          notificationsData,
          unreadData
        ] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount()
        ])

        if (!cancelled) {
          setNotifications(notificationsData)
          setUnreadCount(unreadData.count)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.error ||
            'Error al cargar las notificaciones'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    const interval = setInterval(() => {
      loadNotifications()
    }, POLLING_INTERVAL)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user, loadNotifications])

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId)

      setNotifications(currentNotifications =>
        currentNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )

      setUnreadCount(currentCount =>
        Math.max(0, currentCount - 1)
      )
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al marcar la notificación como leída'
      )

      throw error
    }
  }

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()

      setNotifications(currentNotifications =>
        currentNotifications.map(notification => ({
          ...notification,
          read: true
        }))
      )

      setUnreadCount(0)
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al marcar las notificaciones como leídas'
      )

      throw error
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications: loadNotifications,
    markAsRead,
    markAllAsRead
  }
}