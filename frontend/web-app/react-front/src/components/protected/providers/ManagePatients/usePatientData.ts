import { useEffect, useState } from "react";
import {
  fetchAllPatient,
  fetchAllProfessionals,
  fetchAllDevices,
} from "@/service/api";
import { useNavigate } from "react-router-dom";

interface Patient {
  patient_id: string;
  name: string;
  dob: string;
  address: string;
  contact_number: string;
  email: string;
  status: string;
  professional_id: string;
  device_id: string;
}

interface Professional {
  professional_id: string;
  name: string;
}

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
}

const usePatientData = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, professionalsData, devicesData] =
          await Promise.all([
            fetchAllPatient(navigate),
            fetchAllProfessionals(navigate),
            fetchAllDevices(navigate),
          ]);
        setPatients(patientsData);
        setProfessionals(professionalsData);
        setDevices(devicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return {
    patients,
    professionals,
    devices,
    loading,
    error,
    setPatients,
    setError,
  };
};

export default usePatientData;
