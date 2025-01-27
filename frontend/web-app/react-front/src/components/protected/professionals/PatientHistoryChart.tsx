import { Activity, ChevronUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", patient: 186 },
  { month: "February", patient: 305 },
  { month: "March", patient: 237 },
  { month: "April", patient: 73 },
  { month: "May", patient: 209 },
  { month: "June", patient: 214 },
]

const chartConfig = {
  patient: {
    label: "patient",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
} satisfies ChartConfig

export function PatientHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-fit rounded-md p-1 bg-[#e8fff3]">
            <ChevronUp color="green" size={12}/> <span className="text-green-500 font-semibold">2.2%</span>
        </div>
        <CardTitle>Patient History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="patient"
              type="step"
              fill="#e6f2ff"
              fillOpacity={1}
              stroke="#3e97ff"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
