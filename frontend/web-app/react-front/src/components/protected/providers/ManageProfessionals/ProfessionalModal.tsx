import React, { useState } from "react";

interface ProfessionalModalProps {
  isEdit: boolean;
  professional: {
    name: string;
    specialization: string;
    contact_number: string;
    email: string;
  };
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
}

const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  isEdit,
  professional,
  onClose,
  onSubmit,
  onChange,
}) => {
  const [errors, setErrors] = useState({
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      specialization: "",
      contact_number: "",
      email: "",
    };
    let isValid = true;

    if (!professional.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!professional.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
      isValid = false;
    }
    if (!professional.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
      isValid = false;
    }
    if (!professional.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Professional" : "Add Professional"}
        </h2>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter the name"
              value={professional.name}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  onChange("name", value);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              placeholder="Enter the specialization"
              value={professional.specialization}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  onChange("name", value);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.specialization && (
              <p className="text-red-500 text-xs mt-1">
                {errors.specialization}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="Enter the contact number"
              value={professional.contact_number}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  // Only allow digits (0-9)
                  onChange("contact_number", value);
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />

            {errors.contact_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter the email"
              value={professional.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4 w-full">
          <button
            className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalModal;
