import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import type { StatusBreakdown, StatusBreakdownDevice } from '../../../types/dashboard';
import { fetchAllDevices, fetchAllPatient } from "@/service/api"; // Assuming you have this function
import { useNavigate } from 'react-router-dom';

const DonutChart = ({
  data,
  title,
  total,
}: {
  data: { name: string; value: number; color: string }[];
  title: string;
  total: number;
}) => (
  <div className={`bg-white rounded-xl p-3 shadow-sm flex items-center justify-between`}>
    <div className="flex-1 flex flex-col items-start">
      <h1 className="text-lg font-semibold mb-1">{total}</h1>
      <p className="text-gray-500 mb-1 text-xs">Total {title}</p>

      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="80%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={500}
              blendStroke
              cornerRadius={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={3} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="flex-none ml-4 mt-2 space-y-1 text-xs">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="w-4 h-1 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.name}</span>
          </div>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const StatusCharts = () => {
  const [patientData, setPatientData] = useState<StatusBreakdown | null>(null);
  const [deviceData, setDeviceData] = useState<StatusBreakdownDevice | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const patients = (await fetchAllPatient(navigate)) || [];
        const devices = (await fetchAllDevices(navigate)) || [];
  
        if (!Array.isArray(patients)) {
          throw new Error("Invalid data format: patients is not an array");
        }
        if (!Array.isArray(devices)) {
          throw new Error("Invalid data format: devices is not an array");
        }
        
        const patientStatusBreakdown = patients.reduce(
          (acc: Record<string, number>, patient: { status: string }) => {
            if (patient.status === "active") acc.active += 1;
            else if (patient.status === "inactive") acc.inactive += 1;
            else if (patient.status === "inProgress") acc.inProgress += 1;
            return acc;
          },
          { active: 0, inactive: 0, inProgress: 0 }
        );
  
        const deviceAssignmentBreakdown = devices.reduce(
          (acc: Record<string, number>, device: { is_assigned: boolean }) => {
            if (device.is_assigned) acc.assigned += 1;
            else acc.unassigned += 1;
            return acc;
          },
          { assigned: 0, unassigned: 0 }
        );
  
        const totalPatients = patients.length;
        const totalDevices = devices.length;
  
        setPatientData({
          total: totalPatients,
          active: patientStatusBreakdown.active,
          inactive: patientStatusBreakdown.inactive,
          inProgress: patientStatusBreakdown.inProgress,
        });
  
        setDeviceData({
          total: totalDevices,
          assigned: deviceAssignmentBreakdown.assigned,
          unassigned: deviceAssignmentBreakdown.unassigned,
        });
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };
  
    fetchStatusData();
  }, [navigate]);  

  const chartData = (data: StatusBreakdown) => [
    { name: "Active", value: data.active, color: "#00A3FF" },
    { name: "Inactive", value: data.inactive, color: "#50CD89" },
    { name: "In Progress", value: data.inProgress, color: "#E4E6EF" },
  ];
  const chartDataDevice = (data: StatusBreakdownDevice) => [
    { name: "Assigned", value: data.assigned, color: "#00A3FF" },
    { name: "Unassigned", value: data.unassigned, color: "#E4E6EF" },
  ];

  return (
    <div className="flex flex-col gap-4 max-h-[570px] overflow-hidden">
      {patientData ? (
      <DonutChart
        data={chartData(patientData)}
        title="Patients"
        total={patientData.total}
      />
      ) : (
        <div className="text-center text-gray-500">No patient data available</div>
      )}

    {deviceData ? (
      <DonutChart
        data={chartDataDevice(deviceData)}
        title="Devices"
        total={deviceData.total}
      />
    ) : (
      <div className="text-center text-gray-500">No device data available</div>
    )}
    </div>
  );
};


