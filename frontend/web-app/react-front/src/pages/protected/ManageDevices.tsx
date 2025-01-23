import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/protected/providers/Navigations";
import { Button } from "@/components/ui/button";
import {
  fetchAllPatient,
  addDevice,
  updateDevice,
  fetchAllDevices,
} from "@/service/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/loading";

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
  assigned_to: string;
}

interface Patient {
  institution_id: string;
  patient_id: string;
  name: string;
  dob: string;
  contact_number: string;
  email: string;
  status: string;
  address: string;
  device_id: string;
  oxygen_threshold: number;
  heartrate_threshold: number;
  temperature_threshold: number;
  oxygen_threshold_lower: number;
  heartrate_threshold_lower: number;
  temperature_threshold_lower: number;
  professional_id: string;
}

const ManageDevices: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    is_assigned: "",
    assigned_to: "",
  });
  const navigate = useNavigate();
  // Fetch device data from the API
  useEffect(() => {
    const getDevices = async () => {
      try {
        const data = await fetchAllDevices(navigate);
        setDevices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    getDevices();
  }, [navigate]);

  // Fetch patients data from the API
  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchAllPatient(navigate);
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    getPatients();
  }, [navigate]);

  //get name of doctor by ID
  const getPatientNameById = (patientId: string): string => {
    const patient = patients.find((p) => p.patient_id === patientId);
    return patient ? patient.name : "Unassigned";
  };

  const handleAddDevice = async () => {
    try {
      // Convert is_assigned to a boolean if it's a string
      const isAssignedBoolean =
        typeof newDevice.is_assigned === "string"
          ? newDevice.is_assigned === "true"
          : newDevice.is_assigned;

      // Call the addDevice function to add the device to the backend
      const addedDevice = await addDevice({
        ...newDevice,
        is_assigned: isAssignedBoolean, // Ensure this is a boolean
      });

      setDevices([...devices, addedDevice]);

      // Close the modal and reset the form
      setIsModalOpen(false);
      setNewDevice({
        device_name: "",
        is_assigned: "",
        assigned_to: "",
      });
    } catch (err) {
      // Handle errors
      setError(err instanceof Error ? err.message : "Failed to add device");
    }
  };

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800";
      case false:
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
        return "bg-blue-200 text-gray-800";
    }
  };

  const handleEditDevice = async () => {
    if (!selectedDevice) return; // Ensure selectedDevice is not null

    try {
      const isAssignedBoolean =
        typeof selectedDevice.is_assigned === "string"
          ? selectedDevice.is_assigned === "true"
          : selectedDevice.is_assigned;
      // Call the updateDevice function to update the device in the backend
      const updatedDevice = await updateDevice(selectedDevice.deviceid, {
        deviceid: selectedDevice.deviceid,
        device_name: selectedDevice.device_name,
        is_assigned: isAssignedBoolean,
        assigned_to: selectedDevice.assigned_to,
      });

      // Update the device in the local state
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.deviceid === updatedDevice.deviceid ? updatedDevice : device
        )
      );

      // Close the modal and reset selectedDevice
      setIsEditModalOpen(false);
      setSelectedDevice(null);
    } catch (err) {
      // Handle errors
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

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
      {/* Add New Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Device</h2>

            <div className="space-y-4">
              {/* Device Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Device Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the device name"
                  value={newDevice.device_name}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      device_name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newDevice.is_assigned}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      is_assigned: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Assigned">Assigned</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <select
                  value={newDevice.assigned_to}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      assigned_to: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={newDevice.is_assigned === "Unassigned"} // Disable if status is "Unassigned"
                >
                  <option value="Unassigned">Unassigned</option>
                  {patients
                    .filter((patient) => !patient.device_id) // Filter patients with empty device_id
                    .map((patient) => (
                      <option
                        key={patient.patient_id}
                        value={patient.patient_id}
                      >
                        {patient.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4 w-full">
              <button
                className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleAddDevice}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Device Modal */}
      {isEditModalOpen && selectedDevice && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Device</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Device ID
                </label>
                <input
                  type="text"
                  value={selectedDevice.deviceid}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Device Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Device Name
                </label>
                <input
                  type="text"
                  value={selectedDevice.device_name}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Is Assigned (Toggle Switch) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Assigned
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDevice.is_assigned}
                      onChange={(e) =>
                        setSelectedDevice({
                          ...selectedDevice,
                          is_assigned: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm text-gray-900">
                      {selectedDevice.is_assigned ? "Assigned" : "Unassigned"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Assigned To (Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <select
                  value={selectedDevice.assigned_to}
                  onChange={(e) =>
                    setSelectedDevice({
                      ...selectedDevice,
                      assigned_to: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedDevice.is_assigned} // Disable dropdown if device is unassigned
                >
                  <option value="">Unassigned</option>
                  {patients.map((patient) => (
                    <option key={patient.patient_id} value={patient.patient_id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4 w-full">
              <button
                className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleEditDevice}
              >
                Save
              </button>
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
                    Device Name
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getAssignedColor(
                          device.assigned_to
                        )}`}
                      >
                        {getPatientNameById(device.assigned_to)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors"
                        onClick={() => {
                          setSelectedDevice(device); // Set the device to be edited
                          setIsEditModalOpen(true); // Open the edit modal
                        }}
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
    </div>
  );
};

export default ManageDevices;
