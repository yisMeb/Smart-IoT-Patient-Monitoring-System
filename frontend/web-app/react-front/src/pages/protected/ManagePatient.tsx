import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/protected/providers/Navigations";
import { Button } from "@/components/ui/button";
import {
  fetchAllPatient,
  addPatient,
  updatePatient,
  fetchAllProfessionals,
  fetchAllDevices,
} from "@/service/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/loading";
import { getRoleIDFromCookie } from "../../lib/cookieUtils";

interface Patient {
  patient_id: string;
  institution_id: string;
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
  [key: string]: string | number;
}

interface Professional {
  professional_id: string;
  institution_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string;
}

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
  assigned_to: string;
}

const ManagePatient: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    institution_id: "",
    name: "",
    dob: "",
    contact_number: "",
    email: "",
    status: "NULL",
    address: "",
    device_id: "",
    professional_id: "",
    oxygen_threshold: 0,
    heartrate_threshold: 0,
    temperature_threshold: 0,
    oxygen_threshold_lower: 0,
    heartrate_threshold_lower: 0,
    temperature_threshold_lower: 0,
  });
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const navigate = useNavigate();

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

  // Fetch professionals data from the API
  useEffect(() => {
    const getProfessionals = async () => {
      try {
        const data = await fetchAllProfessionals(navigate);
        setProfessionals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    getProfessionals();
  }, [navigate]);

  // Fetch devices data from the API
  useEffect(() => {
    const getDevices = async () => {
      try {
        const data = await fetchAllDevices(navigate);
        setDevices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    getDevices();
  }, [navigate]);

  // Get the name of a professional by ID
  const getProfessionalNameById = (professionalId: string): string => {
    const professional = professionals.find(
      (p) => p.professional_id === professionalId
    );
    return professional ? professional.name : "Unassigned";
  };

  // Handle the logic for adding a patient
  const handleAddPatient = async () => {
    const roleSpecificId = getRoleIDFromCookie();
    if (!roleSpecificId) {
      setError("Institution ID is missing. Please try again.");
      return;
    }

    try {
      const patientData = {
        ...newPatient,
        institution_id: roleSpecificId,
      };
      const addedPatient = await addPatient(navigate, patientData);
      setPatients([...patients, addedPatient]);

      setIsModalOpen(false);
      setNewPatient({
        name: "",
        dob: "",
        contact_number: "",
        email: "",
        status: "",
        address: "",
        device_id: "",
        professional_id: "",
        institution_id: "",
        oxygen_threshold: 0,
        heartrate_threshold: 0,
        temperature_threshold: 0,
        oxygen_threshold_lower: 0,
        heartrate_threshold_lower: 0,
        temperature_threshold_lower: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient");
    }
  };

  // Handle the logic for editing a patient
  const handleEditPatient = async () => {
    if (!selectedPatient) return;

    try {
      const updatedPatient = await updatePatient(
        navigate,
        selectedPatient.patient_id,
        {
          name: selectedPatient.name,
          dob: selectedPatient.dob,
          contact_number: selectedPatient.contact_number,
          email: selectedPatient.email,
          status: selectedPatient.status,
          address: selectedPatient.address,
          device_id: selectedPatient.device_id,
          professional_id: selectedPatient.professional_id,
        }
      );
      setPatients(
        patients.map((patient) =>
          patient.institution_id === updatedPatient.institution_id
            ? updatedPatient
            : patient
        )
      );
      setIsEditModalOpen(false);
      setSelectedPatient(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update patient");
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
              <h1 className="text-2xl font-bold text-white">Patients</h1>
              <Button
                className="px-4 py-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100 hover:shadow-lg hover:scale-10"
                onClick={() => setIsModalOpen(true)}
              >
                Add Patient
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Patient</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="Enter the date"
                  value={newPatient.dob}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, dob: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter the address"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter the contact number"
                  value={newPatient.contact_number}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      contact_number: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter the email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Professional Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign Doctor
                </label>
                <select
                  value={newPatient.professional_id}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      professional_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a doctor</option>
                  {professionals.map((professional) => (
                    <option
                      key={professional.professional_id}
                      value={professional.professional_id}
                    >
                      {professional.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign Device
                </label>
                <select
                  value={newPatient.device_id}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, device_id: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a device</option>
                  {devices
                    .filter((device) => !device.is_assigned) // Show only unassigned devices
                    .map((device) => (
                      <option key={device.deviceid} value={device.deviceid}>
                        {device.device_name}
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
                onClick={handleAddPatient}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Patient</h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the name"
                  value={selectedPatient.name}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="Enter the date"
                  value={selectedPatient.dob}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      dob: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter the address"
                  value={selectedPatient.address}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      address: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="Enter the contact number"
                  value={selectedPatient.contact_number}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      contact_number: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter the email"
                  value={selectedPatient.email}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      email: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Professional Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign Doctor
                </label>
                <select
                  value={selectedPatient.professional_id}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      professional_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a doctor</option>
                  {professionals.map((professional) => (
                    <option
                      key={professional.professional_id}
                      value={professional.professional_id}
                    >
                      {professional.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign Device
                </label>
                <select
                  value={selectedPatient.device_id}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      device_id: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a device</option>
                  {devices
                    .filter(
                      (device) =>
                        device.is_assigned ||
                        device.deviceid === selectedPatient.device_id
                    ) // Show unassigned devices or the currently assigned device
                    .map((device) => (
                      <option key={device.deviceid} value={device.deviceid}>
                        {device.device_name}
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
                onClick={handleEditPatient}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patients Table */}
      <div className="max-w-screen-lg mx-auto -mt-40">
        <div className="p-6 space-y-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.institution_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.dob}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.contact_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getProfessionalNameById(patient.professional_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.device_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors"
                          onClick={() => {
                            setSelectedPatient(patient);
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
    </div>
  );
};

export default ManagePatient;
