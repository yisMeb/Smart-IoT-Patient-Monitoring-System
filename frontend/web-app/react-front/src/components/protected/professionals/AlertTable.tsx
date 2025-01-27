import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sampleData = [
    {
      id: 1,
      name: "Martha Abebe",
      date: "2024-05-15",
      alert: "Heart rate below threshold: 80 bpm",
      status: "Not normal",
      contact: "0912345678",
    },
    {
      id: 2,
      name: "John Doe",
      date: "2024-07-20",
      alert: "Blood pressure reading high: 150/95 mmHg",
      status: "normal",
      contact: "0912345678",
    },
    {
      id: 3,
      name: "Jane Smith",
      date: "2025-01-30", 
      alert: "Temperature elevated: 40°C",
      status: "normal",
      contact: "0912345678",
    },
];

export const AlertTable = () => {
    return (
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Alert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.name} <br />
                    <span className="text-gray-400 font-normal">{row.contact}</span>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell> 
                      <div 
                        className={`border rounded-md w-fit p-1 ${
                          row.status === "normal" ? "bg-[#fff5f8] border-[#f1416c] text-[#f1416c]" : "bg-[#eef6ff] border-[#3e97ff] text-[#3e97ff]"
                        }`}
                      >
                        {row.alert}
                      </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };
  