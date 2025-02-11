import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addDevice, updateDevice } from "@/service/api";
import DeviceTable from "../../components/protected/providers/ManageDevice/DeviceTable";
import DeviceModal from "../../components/protected/providers/ManageDevice/DeviceModal";
import ErrorModal from "../../components/protected/providers/ManageDevice/ErrorModal";
import useDeviceData from "../../components/protected/providers/ManageDevice/useDeviceData";
import Loading from "../../components/ui/loading";
import { Navigation } from "../../components/protected/providers/Navigations";

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
}

interface DeviceWithPatient extends Device {
  patient_name: string;
}

const ManageDevices: React.FC = () => {
  const { devices, loading, error, setDevices, setError } = useDeviceData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] =
    useState<DeviceWithPatient | null>(null);
  const [newDevice, setNewDevice] = useState({
    device_name: "",
    is_assigned: false,
  });

  const handleAddDevice = async () => {
    try {
      const addedDevice = await addDevice(newDevice);
      setDevices([...devices, { ...addedDevice, patient_name: "Unassigned" }]);
      setIsModalOpen(false);
      setNewDevice({ device_name: "", is_assigned: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device");
    }
  };

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
    }
  };

  if (loading) return <Loading />;

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
      <DeviceTable
        devices={devices}
        onEdit={(device) => {
          setSelectedDevice(device);
          setIsEditModalOpen(true);
        }}
      />

      {isModalOpen && (
        <DeviceModal
          isEdit={false}
          device={newDevice}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddDevice}
          onChange={(field, value) =>
            setNewDevice({ ...newDevice, [field]: value })
          }
        />
      )}
      {isEditModalOpen && selectedDevice && (
        <DeviceModal
          isEdit={true}
          device={selectedDevice}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditDevice}
          onChange={(field, value) =>
            setSelectedDevice({ ...selectedDevice, [field]: value })
          }
        />
      )}
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default ManageDevices;
