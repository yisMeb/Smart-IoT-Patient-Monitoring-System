import { useEffect, useState } from "react";
import { Activity, ChevronUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchPatientAssignmentHistory } from "../../../service/api";
import { useNavigate } from "react-router-dom";

interface PatientData {
  created_at: string;
}

const chartConfig: ChartConfig = {
  patient: {
    label: "Patient",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
};

export function PatientHistoryChart() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<{ month: string; patient: number }[]>([]);

  useEffect(() => {
    async function loadPatientData() {
      try {
        const data: PatientData[] = await fetchPatientAssignmentHistory(navigate);
        if (data) {
          const monthlyCounts: Record<string, number> = {};

          data.forEach((patient) => {
            const month = new Date(patient.created_at).toLocaleString("default", { month: "long" });
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
          });

          const formattedData = Object.entries(monthlyCounts).map(([month, patient]) => ({ month, patient }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    }
    loadPatientData();
  }, [navigate]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-fit rounded-md p-1 bg-[#e8fff3]">
          <ChevronUp color="green" size={12} /> <span className="text-green-500 font-semibold">2.2%</span>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
  );
}
