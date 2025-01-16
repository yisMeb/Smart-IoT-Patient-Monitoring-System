import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/protected/providers/Navigations";
import { Button } from "@/components/ui/button";
import { fetchAllPatient, addPatient, updatePatient } from "@/service/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/loading";

interface Patient {
  institution_id: string;
  name: string;
  dob: string;
  contact_number: string;
  email: string;
  status: string;
  address: string;
  device_id: string;
}

const ManagePatient: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    dob: "",
    contact_number: "",
    email: "",
    status: "",
    address: "",
    device_id: "",
  });
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

  // Handle the logic for adding a patient
  const handleAddPatient = async () => {
    try {
      const addedPatient = await addPatient(newPatient);
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
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient");
    }
  };

  // Handle the logic for editing a patient
  const handleEditPatient = async () => {
    if (!selectedPatient) return;

    try {
      const updatedPatient = await updatePatient(selectedPatient.device_id, {
        name: selectedPatient.name,
        dob: selectedPatient.dob,
        contact_number: selectedPatient.contact_number,
        email: selectedPatient.email,
        status: selectedPatient.status,
        address: selectedPatient.address,
        device_id: selectedPatient.device_id,
      });
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
            </div>

            <div className="mt-6 flex justify-center space-x-4 w-full">
              <Button
                className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleAddPatient}
              >
                Confirm
              </Button>
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
            </div>

            <div className="mt-6 flex justify-center space-x-4 w-full">
              <Button
                className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleEditPatient}
              >
                Save
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
  );
};

export default ManagePatient;
