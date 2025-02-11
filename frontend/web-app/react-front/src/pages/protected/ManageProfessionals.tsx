import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addProfessional, updateProfessional } from "@/service/api";
import ProfessionalTable from "../../components/protected/providers/ManageProfessionals/ProfessionalTable";
import ProfessionalModal from "../../components/protected/providers/ManageProfessionals/ProfessionalModal";
import ErrorModal from "../../components/protected/providers/ManageProfessionals/ErrorModal";
import useProfessionalData from "../../components/protected/providers/ManageProfessionals/useProfessionalData";
import Loading from "../../components/ui/loading";
import { Navigation } from "../../components/protected/providers/Navigations";
import { getRoleIDFromCookie } from "../../lib/cookieUtils";
import { useNavigate } from "react-router-dom";

interface Professional {
  professional_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string;
  institution_id?: string;
}

const ManageProfessionals: React.FC = () => {
  const { professionals, loading, error, setProfessionals, setError } =
    useProfessionalData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleAddProfessional = async () => {
    const roleSpecificId = getRoleIDFromCookie();
    if (!roleSpecificId) {
      setError("Institution ID is missing. Please try again.");
      return;
    }

    try {
      const addedProfessional = await addProfessional(navigate, {
        ...newProfessional,
        institution_id: roleSpecificId,
      });

      setProfessionals([...professionals, addedProfessional]);
      setIsModalOpen(false);
      setNewProfessional({
        name: "",
        specialization: "",
        contact_number: "",
        email: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add professional"
      );
    }
  };

  const handleEditProfessional = async () => {
    if (!selectedProfessional) return;

    try {
      const updatedProfessional = await updateProfessional(
        navigate,
        selectedProfessional.professional_id,
        selectedProfessional
      );
      setProfessionals(
        professionals.map((professional) =>
          professional.professional_id === updatedProfessional.professional_id
            ? updatedProfessional
            : professional
        )
      );
      setIsEditModalOpen(false);
      setSelectedProfessional(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update professional"
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
              <h1 className="text-2xl font-bold text-white">Professionals</h1>
              <Button
                className="px-4 py-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100 hover:shadow-lg hover:scale-10"
                onClick={() => setIsModalOpen(true)}
              >
                Add Professional
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProfessionalTable
        professionals={professionals}
        onEdit={(professional) => {
          setSelectedProfessional(professional);
          setIsEditModalOpen(true);
        }}
      />

      {isModalOpen && (
        <ProfessionalModal
          isEdit={false}
          professional={newProfessional}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProfessional}
          onChange={(field, value) =>
            setNewProfessional({ ...newProfessional, [field]: value })
          }
        />
      )}

      {isEditModalOpen && selectedProfessional && (
        <ProfessionalModal
          isEdit={true}
          professional={selectedProfessional}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProfessional}
          onChange={(field, value) =>
            setSelectedProfessional({ ...selectedProfessional, [field]: value })
          }
        />
      )}

      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default ManageProfessionals;
