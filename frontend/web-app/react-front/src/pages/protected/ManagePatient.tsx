import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addPatient, updatePatient } from "@/service/api";
import PatientTable from "../../components/protected/providers/ManagePatients/PatientTable";
import PatientModal from "../../components/protected/providers/ManagePatients/PatientModal";
import ErrorModal from "../../components/protected/providers/ManagePatients/ErrorModal";
import usePatientData from "../../components/protected/providers/ManagePatients/usePatientData";
import Loading from "../../components/ui/loading";
import { Navigation } from "../../components/protected/providers/Navigations";
import { getRoleIDFromCookie } from "../../lib/cookieUtils";
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

const ManagePatients: React.FC = () => {
  const {
    patients,
    professionals,
    devices,
    loading,
    error,
    setPatients,
    setError,
  } = usePatientData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    dob: "",
    address: "",
    contact_number: "",
    email: "",
    status: "",
    professional_id: "",
    device_id: "",
  });
  const navigate = useNavigate();
  const handleAddPatient = async () => {
    const roleSpecificId = getRoleIDFromCookie();
    if (!roleSpecificId) {
      setError("Institution ID is missing. Please try again.");
      return;
    }

    try {
      const addedPatient = await addPatient(navigate, {
        ...newPatient,
        institution_id: roleSpecificId,
      });
      setPatients([...patients, addedPatient]);
      setIsModalOpen(false);
      setNewPatient({
        name: "",
        dob: "",
        address: "",
        contact_number: "",
        email: "",
        status: "",
        professional_id: "",
        device_id: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add patient");
    }
  };

  const handleEditPatient = async () => {
    if (!selectedPatient) return;

    try {
      const updatedPatient = await updatePatient(
        navigate,
        selectedPatient.patient_id,
        selectedPatient
      );
      setPatients(
        patients.map((patient) =>
          patient.patient_id === updatedPatient.patient_id
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

      <PatientTable
        patients={patients}
        professionals={professionals}
        onEdit={(patient) => {
          setSelectedPatient(patient);
          setIsEditModalOpen(true);
        }}
      />

      {isModalOpen && (
        <PatientModal
          isEdit={false}
          patient={newPatient}
          professionals={professionals}
          devices={devices}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPatient}
          onChange={(field, value) =>
            setNewPatient({ ...newPatient, [field]: value })
          }
        />
      )}

      {isEditModalOpen && selectedPatient && (
        <PatientModal
          isEdit={true}
          patient={selectedPatient}
          professionals={professionals}
          devices={devices}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditPatient}
          onChange={(field, value) =>
            setSelectedPatient({ ...selectedPatient, [field]: value })
          }
        />
      )}

      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default ManagePatients;
