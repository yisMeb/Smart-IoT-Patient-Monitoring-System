import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts'
import { DateRange } from "react-day-picker"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import type { ChartData } from '../../../types/dashboard'

export const PatientChart = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 4),
    to: new Date(2024, 11, 10),
  })

  const data: ChartData[] = [
    { month: "January", value: 54 },
    { month: "February", value: 42 },
    { month: "March", value: 75 },
    { month: "April", value: 110 },
    { month: "May", value: 23 },
    { month: "June", value: 87 },
    { month: "July", value: 50 },
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between flex-wrap">
        <div className="pl-8">
          <h3 className="text-xl font-semibold">Patient Admitted</h3>
          <p className="text-gray-500">Days</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-[#f1f1f2]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "d LLL yyyy")} - {format(date.to, "d LLL yyyy")}
                  </>
                ) : (
                  format(date.from, "d LLL yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="h-[430px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis tickLine={false} axisLine={false} dataKey="month" />
            <YAxis tickLine={false} axisLine={false} />
            <Bar barSize={20} dataKey="value" fill="#3E97FF" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#000" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

