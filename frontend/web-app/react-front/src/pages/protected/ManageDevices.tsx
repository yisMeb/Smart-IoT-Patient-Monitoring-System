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

// New type to combine Device and patient_name
interface DeviceWithPatient extends Device {
  patient_name: string;
}

const ManageDevices: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [patients, setPatients] = useState<Patient[]>([]);
  const [devices, setDevices] = useState<DeviceWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // State for error modal
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    is_assigned: false,
  });
  const navigate = useNavigate();

  // Fetch devices and patients data from the API
  useEffect(() => {
    const getDevicesAndPatients = async () => {
      try {
        const [devicesData, patientsData] = await Promise.all([
          fetchAllDevices(navigate),
          fetchAllPatient(navigate),
        ]);

        // Map patient names to devices
        const devicesWithPatientNames = devicesData.map((device: Device) => {
          const patient = patientsData.find(
            (p: Patient) => p.device_id === device.deviceid
          );
          return {
            ...device,
            patient_name: patient ? patient.name : "Unassigned", // Add patient_name
          };
        });

        setDevices(devicesWithPatientNames);
        setPatients(patientsData); // Suppress unused warning
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsErrorModalOpen(true); // Show error modal
      } finally {
        setLoading(false);
      }
    };

    getDevicesAndPatients();
  }, [navigate]);

  // Handle adding a new device
  const handleAddDevice = async () => {
    try {
      const addedDevice = await addDevice(newDevice);
      setDevices([...devices, { ...addedDevice, patient_name: "Unassigned" }]);
      setIsModalOpen(false);
      setNewDevice({
        device_name: "",
        is_assigned: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device");
      setIsErrorModalOpen(true); // Show error modal
    }
  };

  // Handle editing a device
  const handleEditDevice = async () => {
    if (!selectedDevice) return;

    try {
      const updatedDevice = await updateDevice(
        selectedDevice.deviceid,
        selectedDevice
      );
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.deviceid === updatedDevice.deviceid
            ? { ...updatedDevice, patient_name: device.patient_name }
            : device
        )
      );
      setIsEditModalOpen(false);
      setSelectedDevice(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsErrorModalOpen(true); // Show error modal
    }
  };

  // Get status color based on assignment status
  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Close error modal
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  if (loading) return <Loading />;

  // Render the modal for adding/editing devices
  const renderModal = (isEdit: boolean) => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Device" : "Add New Device"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device Name
            </label>
            <input
              type="text"
              placeholder="Enter the device name"
              value={
                isEdit
                  ? selectedDevice?.device_name || ""
                  : newDevice.device_name
              }
              onChange={(e) =>
                isEdit
                  ? setSelectedDevice({
                      ...selectedDevice!,
                      device_name: e.target.value,
                    })
                  : setNewDevice({ ...newDevice, device_name: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Assigned
              </label>
              <div className="mt-1">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDevice?.is_assigned || false}
                    onChange={(e) => {
                      const isAssigned = e.target.checked;
                      setSelectedDevice({
                        ...selectedDevice!,
                        is_assigned: isAssigned,
                      });
                    }}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-900">
                    {selectedDevice?.is_assigned ? "Assigned" : "Unassigned"}
                  </span>
                </label>
              </div>
            </div>
          )}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Assigned
              </label>
              <div className="mt-1">
                <span className="px-2 py-1 text-sm text-gray-900 bg-gray-100 rounded">
                  Not Assigned
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center space-x-4 w-full">
          <button
            className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            onClick={() =>
              isEdit ? setIsEditModalOpen(false) : setIsModalOpen(false)
            }
          >
            Cancel
          </button>
          <button
            className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={isEdit ? handleEditDevice : handleAddDevice}
          >
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );

  // Render the error modal
  const renderErrorModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={closeErrorModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

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
      {isModalOpen && renderModal(false)}
      {isEditModalOpen && renderModal(true)}
      {isErrorModalOpen && renderErrorModal()} {/* Render error modal */}
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
                        onClick={() => {
                          setSelectedDevice(device);
                          setIsEditModalOpen(true);
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
