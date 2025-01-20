import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/protected/providers/Navigations";
import { Button } from "@/components/ui/button";
import {
  fetchAllProfessionals,
  updateProfessional,
  addProfessional,
} from "@/service/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/loading";
import { getRoleIDFromCookie } from "../../lib/cookieUtils";
interface Professional {
  professional_id: string;
  institution_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string; // Assuming created_at is returned as a string from the API
}

const ManageProfessionals: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [newProfessional, setNewProfessional] = useState({
    institution_id: "",
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
  });
  const [isAdding, setIsAdding] = useState(false); // State for adding professionals
  const [isEditing, setIsEditing] = useState(false); // State for editing professionals
  const navigate = useNavigate();

  // Fetch professionals data from the API
  useEffect(() => {
    const getProfessionals = async () => {
      try {
        const data = await fetchAllProfessionals(navigate);
        setProfessionals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    getProfessionals();
  }, [navigate]);

  // Handle adding a new professional
  const handleAddProfessional = async () => {
    setIsAdding(true); // Start loading
    const roleSpecificId = getRoleIDFromCookie();
    console.log(roleSpecificId);
    if (roleSpecificId) {
      try {
        const professionalToAdd = {
          ...newProfessional,
          institution_id: roleSpecificId,
        };
        console.log(professionalToAdd);
        await addProfessional(professionalToAdd);

        const updatedData = await fetchAllProfessionals(navigate);
        setProfessionals(updatedData);

        setIsModalOpen(false);
        setNewProfessional({
          institution_id: roleSpecificId,
          name: "",
          specialization: "",
          contact_number: "",
          email: "",
        });
      } catch (error) {
        console.error("Error adding professional:", error);
        setError("Failed to add professional. Please try again.");
      } finally {
        setIsAdding(false);
      }
    }
  };

  // Handle editing a professional
  const handleEditProfessional = async () => {
    if (selectedProfessional) {
      setIsEditing(true); // Start loading
      try {
        // Call the updateProfessional function
        await updateProfessional(selectedProfessional.professional_id, {
          name: selectedProfessional.name,
          specialization: selectedProfessional.specialization,
          contact_number: selectedProfessional.contact_number,
          email: selectedProfessional.email,
        });

        // Refresh the list of professionals
        const updatedData = await fetchAllProfessionals(navigate);
        console.log("Updated Data:", updatedData); // Log the updated data
        setProfessionals(updatedData);

        // Close the edit modal
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating professional:", error);
        setError("Failed to update professional. Please try again.");
      } finally {
        setIsEditing(false); // Stop loading
      }
    }
  };

  if (loading) return <Loading />; // Use the Loading component
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
            <div className="flex justify-between items-center mb-4">
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

      {/* Add Professional Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Professional</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the name"
                  value={newProfessional.name}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="Enter the specialization (e.g., Cardiology)"
                  value={newProfessional.specialization}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
                      specialization: e.target.value,
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
                  value={newProfessional.contact_number}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
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
                  value={newProfessional.email}
                  onChange={(e) =>
                    setNewProfessional({
                      ...newProfessional,
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
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleAddProfessional}
                disabled={isAdding} // Disable the button while loading
              >
                {isAdding ? <Loading /> : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Professional Modal */}
      {isEditModalOpen && selectedProfessional && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Professional</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedProfessional.name}
                  onChange={(e) =>
                    setSelectedProfessional({
                      ...selectedProfessional,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <input
                  type="text"
                  value={selectedProfessional.specialization}
                  onChange={(e) =>
                    setSelectedProfessional({
                      ...selectedProfessional,
                      specialization: e.target.value,
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
                  value={selectedProfessional.contact_number}
                  onChange={(e) =>
                    setSelectedProfessional({
                      ...selectedProfessional,
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
                  value={selectedProfessional.email}
                  onChange={(e) =>
                    setSelectedProfessional({
                      ...selectedProfessional,
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
                onClick={handleEditProfessional}
                disabled={isEditing} // Disable the button while loading
              >
                {isEditing ? <Loading /> : "Save"}
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
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professionals.map((professional) => (
                  <tr key={professional.professional_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {professional.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {professional.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {professional.contact_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {professional.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(professional.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors"
                        onClick={() => {
                          setSelectedProfessional(professional); // Set the selected professional
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

export default ManageProfessionals;
