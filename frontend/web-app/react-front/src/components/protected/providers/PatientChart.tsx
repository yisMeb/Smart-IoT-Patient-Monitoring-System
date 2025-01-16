import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllPatient } from "@/service/api";
import type { ChartData } from "../../../types/dashboard";
import { useNavigate } from "react-router-dom";

export const PatientChart = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 4),
    to: new Date(2024, 11, 10),
  });

  const [data, setData] = useState<ChartData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const patients = (await fetchAllPatient(navigate)) || [];
        if (!Array.isArray(patients)) {
          throw new Error("Invalid data format: patients is not an array");
        }
  
        const groupedData = patients.reduce(
          (acc: Record<string, number>, patient: { created_at: string }) => {
            const month = format(new Date(patient.created_at), "MMMM");
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          },
          {}
        );
        const chartData: ChartData[] = Object.entries(groupedData).map(([month, value]) => ({
          month,
          value: Number(value),
        }));
  
        setData(chartData);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    loadChartData();
  }, []);

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
      {data.length > 0 ? (
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
        ) : (
          <div className="text-center text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
};
