import { useEffect, useRef, useState } from 'react'
import {
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Mail,
  CheckSquare
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'

function AppLayout({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications()

  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notificationsRef = useRef(null)

  const displayName = user?.username || 'User'
  const avatarLetter = displayName.charAt(0).toUpperCase()

const recentNotifications = notifications.slice(0, 5)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }

  setNotificationsOpen(false)
  navigate('/tasks')
}

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

      <aside
        className="
          fixed
          inset-y-0
          left-0
          flex
          w-64
          flex-col
          border-r
          border-white/10
          bg-[var(--bg-secondary)]
        "
      >

        {/* Logo */}

        <div className="p-6">
          <h1 className="text-xl font-semibold">
            NEO
          </h1>
        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4">

          <button
            onClick={() => navigate('/dashboard')}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-gradient-to-r
              from-violet-600/80
              to-purple-600/80
              px-4
              py-3
              text-sm
              font-medium
              text-[var(--text-primary)]
              shadow-lg
              shadow-violet-900/20
            "
          >
            <User size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate('/tasks')}
            className="
              mt-2
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-[var(--text-secondary)]
              transition
              hover:bg-white/5
              hover:text-[var(--text-primary)]
            "
          >
            <CheckSquare size={18} />
            Tasks
          </button>

          <button
            onClick={() => navigate('/team')}
            className="
              mt-2
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-[var(--text-secondary)]
              transition
              hover:bg-white/5
              hover:text-[var(--text-primary)]
            "
          >
            <User size={18} />
            Team
          </button>

          {user?.role === 'manager' && (
            <button
              onClick={() => navigate('/join-requests')}
              className="
                mt-2
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-[var(--text-secondary)]
                transition
                hover:bg-white/5
                hover:text-[var(--text-primary)]
              "
            >
              <Mail size={18} />
              Join Requests
            </button>
          )}

          <button
            onClick={() => navigate('/organization')}
            className="
              mt-2
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-[var(--text-secondary)]
              transition
              hover:bg-white/5
              hover:text-[var(--text-primary)]
            "
          >
            <User size={18} />
            Organization
          </button>

        </nav>


        {/* Bottom navigation */}

        <div className="space-y-2 border-t border-white/10 p-4">

          <button
            onClick={() => navigate('/settings')}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-[var(--text-secondary)]
              transition
              hover:bg-white/5
              hover:text-[var(--text-primary)]
            "
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-[var(--text-secondary)]
              transition
              hover:bg-white/5
              hover:text-[var(--text-primary)]
            "
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main area */}

      <div className="min-h-screen pl-64">

        {/* Header */}

          <header
            className="
              relative
              z-50
              flex
              h-16
              items-center
              justify-between
              border-b
              border-white/10
              bg-[var(--bg-primary)]
              px-8
              backdrop-blur-xl
            "
          >

          {/* Search */}

          <div
            className="
              flex
              w-72
              items-center
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2
            "
          >
            <Search
              size={17}
              className="text-[var(--text-secondary)]"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-full
                bg-transparent
                text-sm
                text-[var(--text-primary)]
                outline-none
                placeholder:text-[var(--text-secondary)]
              "
            />
          </div>


          {/* Header actions */}

          <div className="flex items-center gap-4">

            {/* Notifications */}

            <div
              ref={notificationsRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    current => !current
                  )
                }
                className={`
                  relative
                  rounded-lg
                  p-2
                  transition
                  hover:bg-white/5
                  ${
                    unreadCount > 0
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <Bell size={18} />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      min-h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500/90
                      px-1
                      text-[9px]
                      font-semibold
                      text-white
                    "
                  >
                    {unreadCount > 9
                      ? '9+'
                      : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-96
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-[var(--bg-secondary)]
                    shadow-2xl
                  "
                >

                  {/* Notifications header */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <h2 className="text-sm font-semibold">
                        Notifications
                      </h2>

                      {unreadCount > 0 && (
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="
                          text-xs
                          text-violet-300
                          transition
                          hover:text-violet-200
                        "
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>


                  {/* Notifications list */}

                  <div className="max-h-[420px] overflow-y-auto">

                    {recentNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-[var(--text-secondary)]">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      recentNotifications.map(notification => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className={`
                            flex
                            w-full
                            gap-3
                            border-b
                            border-white/5
                            px-4
                            py-3
                            text-left
                            transition
                            hover:bg-white/5
                            ${
                              notification.read
                                ? 'bg-transparent'
                                : 'bg-white/[0.03]'
                            }
                          `}
                        >

                          <div className="pt-1">
                            <span
                              className={`
                                block
                                h-2
                                w-2
                                rounded-full
                                ${
                                  notification.read
                                    ? 'bg-white/10'
                                    : 'bg-violet-400'
                                }
                              `}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p
                              className={`
                                text-sm
                                ${
                                  notification.read
                                    ? 'text-[var(--text-secondary)]'
                                    : 'text-[var(--text-primary)]'
                                }
                              `}
                            >
                              {notification.message}
                            </p>

                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>

                          </div>

                        </button>
                      ))
                    )}

                  </div>

                </div>
              )}
            </div>


            {/* User */}

            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-3
                py-2
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500
                  to-blue-500
                  text-xs
                  font-semibold
                "
              >
                {avatarLetter}
              </div>

              <span className="text-sm text-[var(--text-secondary)]">
                {displayName}
              </span>

            </div>

          </div>

        </header>


        {/* Page content */}

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  )
}

export default AppLayout