import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchPatientAlert } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

type PatientAlert = {
  id: number;
  name: string;
  contact_number: string;
  oxygen_thresholds: string;
  heartrate_thresholds: string;
  temperature_thresholds: string;
  device_status: string;
  status: string;
};

export const DataTable = () => {
  const [data, setData] = useState<PatientAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPatientAlert(navigate);
      console.log("Fetched data:", response);

      if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error("Unexpected response format:", response);
        setError("Unexpected data format received from the server");
        setData([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  if (error) {
    console.log("Error:", error);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <span>Patient Alerts</span>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Sensor</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name} <br />
                      <span className="text-gray-400 font-normal">
                        {row.contact_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      {row.heartrate_thresholds} <br />
                      {row.oxygen_thresholds} <br />
                      {row.temperature_thresholds}
                    </TableCell>
                    <TableCell>{row.device_status}</TableCell>
                    <TableCell className="text-right flex justify-end">
                      <div
                        className={`font-bold w-fit p-1 rounded-md ${
                          row.status === "risky"
                            ? "bg-[#fff8e0] text-[#f3587a]"
                            : "bg-[#fff8e0] text-[#ffd338]"
                        }`}
                      >
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No patient alerts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};