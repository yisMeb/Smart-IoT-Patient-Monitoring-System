import { Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData1 = [
  { week: "Mon", resolved: 186 },
  { week: "Tue", resolved: 305 },
  { week: "Wen", resolved: 237 },
  { week: "Thur", resolved: 73 },
  { week: "Fir", resolved: 209 },
  { week: "Sat", resolved: 214 },
];

const chartData2 = [
  { week: "Mon", unresolved: 120 },
  { week: "Tue", unresolved: 250 },
  { week: "Wen", unresolved: 200 },
  { week: "Thur", unresolved: 50 },
  { week: "Fir", unresolved: 125 },
  { week: "Sat", unresolved: 100 },
];

const chartData3 = [
  { week: "Mon", total_alert: 50 },
  { week: "Tue", total_alert: 80 },
  { week: "Wen", total_alert: 200 },
  { week: "Thur", total_alert: 250 },
  { week: "Fir", total_alert: 150 },
  { week: "Sat", total_alert: 100 },
];

const chartConfigs = [
  {
    label: "weekly resolved Alerts",
    dataKey: "resolved",
    data: chartData1,
    color: {
      fill: "#dcf5e7",
      stroke: "#50cd89",
    },
    metric: 10,
  },
  {
    label: "Weekly unresolved Alerts",
    dataKey: "unresolved",
    data: chartData2,
    color: {
      fill: "#fbe9e7",
      stroke: "#e64a19",
    },
    metric: 25,
  },
  {
    label: "alerts received",
    dataKey: "total_alert",
    data: chartData3,
    color: {
      fill: "#d8eaff",
      stroke: "#3e97ff",
    },
    metric: 15,
  },
];

export function CardChart() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chartConfigs.map((config, index) => {
          const bgColors = ["#e8fff3", "#fbe9e7", "#d8eaff"];
          const textColors = ["#0f9d58", "#e64a19", "#3e97ff"];
  
          return (
            <Card
              key={index}
              className="border border-gray-200 rounded-lg bg-transparent z-10 relative"
            >
              <CardHeader className="flex flex-row justify-between">
                <div className="text-white">
                  <CardDescription className="text-white">
                    {config.label}
                  </CardDescription>
                  <CardTitle>{config.dataKey}</CardTitle>
                </div>
                <div
                  className={`p-2 rounded-md font-semibold`}
                  style={{
                    backgroundColor: bgColors[index],
                    color: textColors[index],
                  }}
                >
                  {config.metric}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer
                  config={{
                    [config.dataKey]: {
                      label: config.dataKey,
                      color: config.color.stroke,
                    },
                  }}
                >
                  <AreaChart
                    accessibilityLayer
                    data={config.data}
                    margin={{
                      left: -24,
                      right: -24,
                      top: 0,
                      bottom: 0,
                    }}
                  >
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      dataKey={config.dataKey}
                      type="natural"
                      fill={config.color.fill}
                      fillOpacity={1}
                      stroke={config.color.stroke}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
  