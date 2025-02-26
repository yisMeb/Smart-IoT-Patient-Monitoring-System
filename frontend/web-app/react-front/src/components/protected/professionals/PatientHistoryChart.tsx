import { useEffect, useState } from "react";
import { Activity, ChevronUp } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadPatientData() {
      setLoading(true);
      setError(null);

      try {
        const data: PatientData[] = await fetchPatientAssignmentHistory(navigate);

        if (abortController.signal.aborted) {
          return;
        }

        if (!data || !Array.isArray(data)) {
          setError("Failed to retrieve data.");
          return;
        }

        const monthlyCounts: Record<string, number> = {};
        data.forEach((patient) => {
          if (abortController.signal.aborted) {
            return;
          }
          const date = new Date(patient.created_at);
          const month = date.toLocaleString("default", { month: "long" }) + ` ${date.getFullYear()}`;
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const formattedData = Object.entries(monthlyCounts)
          .map(([month, patient]) => ({
            month,
            patient,
            timestamp: new Date(month).getTime(), 
          }))
          .sort((a, b) => a.timestamp - b.timestamp) 
          .map(({ month, patient }) => ({ month, patient }));

        if (formattedData.length < 2) {
          formattedData.unshift({ month: "Jan", patient: 0 });
        }

        setChartData(formattedData);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setError("Error fetching patient data");
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center w-fit rounded-md p-1 bg-[#e8fff3]">
          <ChevronUp color="green" size={12} /> <span className="text-green-500 font-semibold">2.2%</span>
        </div>
        <CardTitle>Patient History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="patient"
              type="monotone"
              stroke="#3e97ff"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
