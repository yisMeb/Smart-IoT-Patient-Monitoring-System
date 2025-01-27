import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { fetchAssingnedPatients } from "../../../service/api";
import { Button } from "@/components/ui/button";

interface Patient {
  patient_id: string;
  name: string;
  dob: string;
  contact_number: string;
  email: string;
  status: string;
}

export const AssignedPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssingnedPatients(navigate);
      setPatients(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
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

  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardContent>
        <div className="flex justify-end items-center mb-4 mt-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="icon"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.patient_id}>
                  <TableCell className="font-medium">
                    {patient.name} <br />
                    <span className="text-gray-400 font-normal">
                      {patient.email}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.contact_number}</TableCell>
                  <TableCell className="text-right">
                    <div
                      className={`font-bold w-fit p-1 rounded-md bg-[#fff8e0] text-[#ffd338]`}
                    >
                      {patient.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-[#aeb2c1] border rounded-md bg-[#e5e6e9]">
                      <ChevronRight size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
