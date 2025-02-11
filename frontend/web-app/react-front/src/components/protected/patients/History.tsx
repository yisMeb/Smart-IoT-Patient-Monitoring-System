import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { fetchCase } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import { ContactProff } from "../../../service/api";

interface HistoryEntry {
  date: string;
  note: string;
}

export default function History() {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState("...");
  const [doctorContact, setDoctorContact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const data = await fetchCase(navigate);
        if (isMounted) {
          if (data && Array.isArray(data)) {
            const formattedData = data.map((entry) => ({
              date: new Date(entry.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              note: entry.remark,
            }));
            setHistoryData(formattedData);
            setLastUpdated("Just now");
          } else {
            setHistoryData([]);
            setLastUpdated("Just now");
          }
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        if (isMounted) {
          setHistoryData([]);
          setLastUpdated("Just now");
        }
      }
    };

    const fetchDoctorContact = async () => {
      setLoading(true);
      setError(false);
      try {
        const doctors = await ContactProff(navigate);
        if (doctors.length > 0 && doctors[0].contact_number) {
          setDoctorContact(doctors[0].contact_number);
        } else {
          throw new Error("No doctor contact available");
        }
      } catch (error) {
        console.error("Error fetching doctor contact:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    fetchDoctorContact();

    const intervalId = setInterval(() => {
      if (isMounted) {
        setLastUpdated("Just now");
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [navigate]);

  const handleCallDoctor = () => {
    if (doctorContact) {
      window.location.href = `tel:${doctorContact}`;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex md:flex-row flex-col items-center justify-between space-y-4 md:space-y-0 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Case history</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Updated {lastUpdated}
          </div>
        </div>
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white w-full md:w-auto"
          onClick={handleCallDoctor}
          disabled={loading || error || !doctorContact}
        >
          {loading ? "Loading..." : error ? "Unavailable" : "Call Doctor"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-6">
          {historyData.length > 0 ? (
            historyData.map((entry, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{entry.date}</div>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg max-w-[90%] text-sm">
                  {entry.note}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No history available.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
