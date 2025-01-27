import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
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
      dateOfBirth: "1990-05-15",
      contact: "+25191245457",
      status: "Not Assigned",
    },
    {
      id: 2,
      name: "John Doe",
      dateOfBirth: "1985-07-20",
      contact: "+1234567890",
      status: "Assigned",
    },
    {
      id: 3,
      name: "Jane Smith",
      dateOfBirth: "1992-11-30", 
      contact: "+9876543210",
      status: "Assigned",
    },
  ];
  

export const AssignedPatients = () => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Date of birth</TableHead>
              <TableHead>Contact number</TableHead>
              <TableHead>Sensor</TableHead>
              <TableHead className="text-right">Case</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {row.name} <br />
                  <span className="text-gray-400 font-normal">{row.contact}</span>
                </TableCell>
                <TableCell>{row.dateOfBirth}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`font-bold w-fit p-1 rounded-md ${
                      row.status === "Not Assigned"
                        ? "bg-[#fff8e0] text-[#f3587a]"
                        : "bg-[#fff8e0] text-[#ffd338]"
                    }`}
                  >
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-[#aeb2c1] border rounded-md bg-[#e5e6e9]"><ChevronRight size={18}/></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
