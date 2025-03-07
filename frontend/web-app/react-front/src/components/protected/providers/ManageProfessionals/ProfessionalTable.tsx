import React, { useState } from "react";

interface Professional {
  professional_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string;
}

interface ProfessionalTableProps {
  professionals: Professional[];
  onEdit: (professional: Professional) => void;
  onDelete: (professional_id: string) => Promise<void>;
}

const ProfessionalTable: React.FC<ProfessionalTableProps> = ({
  professionals,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProfessionals = professionals.filter((professional) =>
    [professional.name, professional.email, professional.specialization].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async () => {
    if (!selectedProfessional) return;
    setIsDeleting(true);
    try {
      await onDelete(selectedProfessional.professional_id);
    } catch (error) {
      console.error("Error deleting professional:", error);
    } finally {
      setIsDeleting(false);
      setSelectedProfessional(null);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto -mt-40">
      <div className="p-4 space-y-4">
        <div className="flex justify-between mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded-md w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Specialization
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Contact
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Date
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessionals.map((professional) => (
                <tr key={professional.professional_id} className="h-16">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {professional.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 truncate">
                    {professional.specialization}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 truncate">
                    {professional.contact_number}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 truncate">
                    {professional.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(professional.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => onEdit(professional)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => setSelectedProfessional(professional)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProfessional && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p>Are you sure you want to delete {selectedProfessional.name}?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setSelectedProfessional(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTable;
