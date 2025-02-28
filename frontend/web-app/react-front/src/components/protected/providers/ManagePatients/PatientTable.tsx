import React, { useState } from "react";

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

interface PatientTableProps {
  patients: Patient[];
  professionals: { professional_id: string; name: string }[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => Promise<void>; // Add onDelete prop
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  professionals,
  onEdit,
  onDelete, // Destructure onDelete
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null); // Track patient to delete

  const getProfessionalNameById = (professionalId: string): string => {
    const professional = professionals.find(
      (p) => p.professional_id === professionalId
    );
    return professional ? professional.name : "Unassigned";
  };

  const openModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (patientId: string) => {
    setPatientToDelete(patientId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPatientToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (patientToDelete) {
      try {
        await onDelete(patientToDelete); // Call the onDelete function
        closeDeleteModal(); // Close the modal after deletion
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  return (
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.patient_id}>
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
                      {patient.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getProfessionalNameById(patient.professional_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => onEdit(patient)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          onClick={() => openDeleteModal(patient.patient_id)}
                        >
                          Delete
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          onClick={() => openModal(patient)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for patient details */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Patient Details</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedPatient.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Date of Birth:</strong> {selectedPatient.dob}
              </p>
              <p>
                <strong>Address:</strong> {selectedPatient.address}
              </p>
              <p>
                <strong>Contact Number:</strong>{" "}
                {selectedPatient.contact_number}
              </p>
              <p>
                <strong>Status:</strong> {selectedPatient.status}
              </p>
              <p>
                <strong>Assigned Doctor:</strong>{" "}
                {getProfessionalNameById(selectedPatient.professional_id)}
              </p>
              <p>
                <strong>Device ID:</strong> {selectedPatient.device_id}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete this patient? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
