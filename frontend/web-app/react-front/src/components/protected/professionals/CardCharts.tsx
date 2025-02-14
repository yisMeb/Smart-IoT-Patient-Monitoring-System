import { useEffect, useState } from "react";
import { 
  Area, AreaChart, XAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { fetchAllAlertProfess, fetchResolvedAlertProfessional, fetchUnesolvedAlertProfessional } from "../../../service/api";
import { useNavigate } from "react-router-dom";

interface Alert {
  timestamp: string;
}

interface ChartData {
  date: string;
  resolved: number;
  unresolved: number;
  total_alert: number;
}

export function CardChart() {
  const [chartData, setChartData] = useState<{ resolved: ChartData[]; unresolved: ChartData[]; total_alert: ChartData[] }>({
    resolved: [],
    unresolved: [],
    total_alert: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([
          fetchResolvedAlertProfessional(navigate) as Promise<Alert[]>,
          fetchUnesolvedAlertProfessional(navigate) as Promise<Alert[]>,
          fetchAllAlertProfess(navigate) as Promise<{ data: Alert[] }>,
        ]);

        const processData = (data: Alert[]): Record<string, number> => {
          return data.reduce((acc: Record<string, number>, curr: Alert) => {
            const dateStr = new Date(curr.timestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
          }, {});
        };

        const sortData = (counts: Record<string, number>) => {
          return Object.keys(counts).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          ).map((date) => ({ date, count: counts[date] }));
        };

        const resolvedCounts = processData(responses[0]);
        const unresolvedCounts = processData(responses[1]);
        const totalCounts = processData(responses[2].data);

        const sortedResolvedCounts = sortData(resolvedCounts);
        const sortedUnresolvedCounts = sortData(unresolvedCounts);
        const sortedTotalCounts = sortData(totalCounts);

        const resolvedChartData = sortedResolvedCounts.map((item) => ({
          date: item.date,
          resolved: item.count,
        }));
        const unresolvedChartData = sortedUnresolvedCounts.map((item) => ({
          date: item.date,
          unresolved: item.count,
        }));
        /* const totalChartData = sortedTotalCounts.map((item) => ({
          date: item.date,
          total_alert: item.count,
        })); */
        const combinedChartData = sortedTotalCounts.map((item, index) => ({
          date: item.date,
          resolved: resolvedChartData.length > index ? resolvedChartData[index].resolved : 0,
          unresolved: unresolvedChartData.length > index ? unresolvedChartData[index].unresolved : 0,
          total_alert: item.count,
        }));

        setChartData({ resolved: combinedChartData, unresolved: combinedChartData, total_alert: combinedChartData });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    }

    fetchData();
  }, [navigate]);

  const chartConfigs = [
    {
      label: "Resolved Alerts",
      dataKey: "resolved",
      data: chartData.resolved,
      color: { fill: "#dcf5e7", stroke: "#50cd89" },
    },
    {
      label: "Unresolved Alerts",
      dataKey: "unresolved",
      data: chartData.unresolved,
      color: { fill: "#fbe9e7", stroke: "#e64a19" },
    },
    {
      label: "Total Alerts Received",
      dataKey: "total_alert",
      data: chartData.total_alert,
      color: { fill: "#d8eaff", stroke: "#3e97ff" },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {chartConfigs.map((config, index) => (
        <Card key={index} className="border border-gray-200 rounded-lg bg-transparent z-10 relative">
          <CardHeader className="flex flex-row justify-between">
            <div className="text-white">
              <CardDescription className="text-white">{config.label}</CardDescription>
              <CardTitle>{config.dataKey}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                [config.dataKey]: { label: config.dataKey, color: config.color.stroke },
                xKey: { label: "Date", color: config.color.stroke },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={config.data}
                margin={{ left: -24, right: -24, top: 0, bottom: 0 }}
              >
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area
                  dataKey={config.dataKey}
                  type="natural"
                  fill={config.color.fill}
                  fillOpacity={1}
                  stroke={config.color.stroke}
                  strokeWidth={2}
                />
                <XAxis dataKey="date" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
