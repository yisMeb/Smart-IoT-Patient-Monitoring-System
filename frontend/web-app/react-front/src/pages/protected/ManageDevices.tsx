import React, { useState } from "react";
import { Navigation } from "../../components/protected/providers/Navigations";
import { Button } from "@/components/ui/button";

const ManageDevices: React.FC = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddDevice = () => {
    // Handle the logic for adding a device
    console.log("Device added");
    setIsModalOpen(false); // Close the modal after confirming
  };
  const devices = [
    {
      id: "001",
      type: "Heart rate sensor",
      status: "Active",
      assignedTo: "Martha Kebede",
    },
    {
      id: "002",
      type: "Heart rate sensor",
      status: "Inactive",
      assignedTo: "Unassigned",
    },
    {
      id: "003",
      type: "Heart rate sensor",
      status: "Active",
      assignedTo: "John Doe",
    },
    // Add more devices as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getAssignedColor = (assignedTo: string) => {
    switch (assignedTo) {
      case "Unassigned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /*  const handleEdit = (deviceId: string) => {
    console.log(`Edit device with ID: ${deviceId}`);
    // Add your edit logic here
  }; */

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="pb-48"
        style={{
          backgroundImage: 'url("/Background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-screen-lg mx-auto">
          <Navigation />

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Devices</h1>
              <Button
                className="px-4 py-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100 hover:shadow-lg hover:scale-10"
                onClick={() => setIsModalOpen(true)}
              >
                Add Device
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Device</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Device Type
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="" // Default empty value to show placeholder
                >
                  <option value="" disabled>
                    Select the device type
                  </option>
                  <option value="Both">Heart Rate & Temperature Sensor</option>
                  <option value="HeartRate Sensor">Heart Rate Sensor</option>
                  <option value="Temperature Sensor">Temperature Sensor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Device State
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select the state of the device
                  </option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input type="date" value={currentDate} readOnly />
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4 w-full">
              <Button
                className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)} // Close the modal
              >
                Cancel
              </Button>
              <Button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleAddDevice} // Handle the confirm action
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          device.status
                        )}`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getAssignedColor(
                          device.assignedTo
                        )}`}
                      >
                        {device.assignedTo}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors">
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
    </div>
  );
};

export default ManageDevices;
