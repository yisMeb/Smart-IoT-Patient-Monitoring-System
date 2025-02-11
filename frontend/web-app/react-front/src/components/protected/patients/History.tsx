import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface HistoryEntry {
  date: string
  note: string
}

const historyData: HistoryEntry[] = [
  {
    date: "Jan 9, 2025",
    note: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
  {
    date: "Nov 9, 2024",
    note: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
  {
    date: "Nov 9, 2024",
    note: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
  {
    date: "Nov 9, 2024",
    note: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
]

export default function History() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex md:flex-row flex-col items-center justify-between space-y-4 md:space-y-0 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">My history</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Update 37 minutes ago
          </div>
        </div>
        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto">
          Call Doctor
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-6">
          {historyData.map((entry, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">{entry.date}</div>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg max-w-[90%] text-sm">{entry.note}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
