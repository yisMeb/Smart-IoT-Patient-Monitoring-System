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
import { fetchPatientAlertTable } from "../../../service/api"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

type Alert = {
  id: number;
  message: string;
  name: string;
  contact_number: string;
  timestamp: string;
};

export const AlertTable = () => {
  const [data, setData] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPatientAlertTable(navigate);
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

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <span>Patient Alerts</span>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="icon"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Alert</TableHead>
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
                      {new Date(row.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
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