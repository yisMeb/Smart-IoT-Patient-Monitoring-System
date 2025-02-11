import React from "react";

interface DeviceWithPatient {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
  patient_name: string;
}

interface DeviceTableProps {
  devices: DeviceWithPatient[];
  onEdit: (device: DeviceWithPatient) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onEdit }) => {
  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="max-w-screen-lg mx-auto -mt-40">
      <div className="p-6 space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices.map((device) => (
                <tr key={device.deviceid}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.deviceid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.device_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        device.is_assigned
                      )}`}
                    >
                      {device.is_assigned ? "Assigned" : "Unassigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.patient_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors"
                      onClick={() => onEdit(device)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceTable;
