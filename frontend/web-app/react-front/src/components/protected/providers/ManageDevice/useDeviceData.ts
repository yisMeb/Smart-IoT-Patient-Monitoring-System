import { useEffect, useState } from "react";
import { fetchAllDevices, fetchAllPatient } from "@/service/api";
import { useNavigate } from "react-router-dom";

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
}

interface Patient {
  device_id: string;
  name: string;
}

interface DeviceWithPatient extends Device {
  patient_name: string;
}

const useDeviceData = () => {
  const [devices, setDevices] = useState<DeviceWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getDevicesAndPatients = async () => {
      try {
        const [devicesData, patientsData] = await Promise.all([
          fetchAllDevices(navigate),
          fetchAllPatient(navigate),
        ]);

        const devicesWithPatientNames = devicesData.map((device: Device) => {
          const patient = patientsData.find(
            (p: Patient) => p.device_id === device.deviceid
          );
          return {
            ...device,
            patient_name: patient ? patient.name : "Unassigned",
          };
        });

        setDevices(devicesWithPatientNames);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    getDevicesAndPatients();
  }, [navigate]);

  return { devices, loading, error, setDevices, setError };
};

export default useDeviceData;
