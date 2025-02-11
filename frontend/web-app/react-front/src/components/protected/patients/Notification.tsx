import { useEffect, useState } from "react"
import { Bell, Clock, RefreshCw } from "lucide-react"
import { fetchNewNotifications } from "../../../service/api"
import { useNavigate } from "react-router-dom"

interface Notification {
  date: string
  message: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await fetchNewNotifications(navigate)
      if (data && data.length > 0) {
        setNotifications(
          data.map((notif: { date: string; message: string }) => ({
            date: new Date(notif.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }),
            message: notif.message,
          })),
        )
      } else {
        setNotifications([])
      }
      setLastUpdated(new Date())
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const getTimeAgo = (timestamp: Date | null) => {
    if (!timestamp) return "Just now"
    const diff = Math.floor((new Date().getTime() - timestamp.getTime()) / 60000)
    if (diff < 1) return "Just now"
    if (diff === 1) return "1 minute ago"
    return `${diff} minutes ago`
  }

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg shadow-sm">
      <div className="p-4 space-y-1 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Updated {getTimeAgo(lastUpdated)}</span>
            </div>
            <button
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              onClick={loadNotifications}
              disabled={loading}
              aria-label="Refresh notifications"
            >
              <RefreshCw 
                className={`h-4 w-4 transition-all ${
                  loading ? 'animate-spin text-blue-500' : ''
                }`} 
              />
              <div className={`absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full transition-opacity ${
                loading ? 'animate-spin opacity-25' : 'opacity-0'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {loading && !notifications ? (
          <p className="text-center text-gray-500">Loading notifications...</p>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-2 md:gap-4 items-center">
                <div className="text-sm text-gray-500">{notification.date}</div>
                <div className="bg-blue-50 text-blue-700 rounded-lg p-3 text-sm">{notification.message}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No Notifications yet!</p>
        )}
      </div>
    </div>
  )
}