import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock } from "lucide-react"

interface Notification {
  date: string
  message: string
}

export default function Notifications() {
  const notifications: Notification[] = [
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
    {
      date: "Nov 24,2024",
      message: "Oxygen level exceeded from normal threshold",
    },
  ]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Update 37 minutes ago</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-2 md:gap-4 items-center">
              <div className="text-sm text-muted-foreground">{notification.date}</div>
              <div className="bg-blue-50 text-blue-700 rounded-lg p-3 text-sm">{notification.message}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

