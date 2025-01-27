import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    contact: "+25191245457",
    threshold: "70-80 bpm",
    sensor: "Heartbeat",
    status: "risky",
  },
  {
    id: 2,
    name: "John Doe",
    contact: "+1234567890",
    threshold: "90-100 bpm",
    sensor: "Temperature",
    status: "warning",
  },
  {
    id: 3,
    name: "Jane Smith",
    contact: "+9876543210",
    threshold: "60-70 bpm",
    sensor: "Oxygen",
    status: "risky",
  },
];

export const DataTable = () => {
  return (
    <Card>
      <CardHeader>Patient Alerts</CardHeader>
      <CardContent>
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
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {row.name} <br />
                  <span className="text-gray-400 font-normal">{row.contact}</span>
                </TableCell>
                <TableCell>{row.threshold}</TableCell>
                <TableCell>{row.sensor}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
