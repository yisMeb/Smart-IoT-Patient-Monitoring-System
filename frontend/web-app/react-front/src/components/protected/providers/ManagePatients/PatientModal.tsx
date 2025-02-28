import React, { useState } from "react";

interface PatientModalProps {
  isEdit: boolean;
  patient: {
    name: string;
    dob: string;
    address: string;
    contact_number: string;
    email: string;
    status: string;
    professional_id: string;
    device_id: string;
  };
  professionals: { professional_id: string; name: string }[];
  devices: { deviceid: string; device_name: string; is_assigned: boolean }[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
}

const PatientModal: React.FC<PatientModalProps> = ({
  isEdit,
  patient,
  professionals,
  devices,
  onClose,
  onSubmit,
  onChange,
}) => {
  const [errors, setErrors] = useState({
    name: "",
    dob: "",
    address: "",
    contact_number: "",
    email: "",
    professional_id: "",
    device_id: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      dob: "",
      address: "",
      contact_number: "",
      email: "",
      professional_id: "",
      device_id: "",
    };
    let isValid = true;

    if (!patient.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!patient.dob.trim()) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    }
    if (!patient.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!patient.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
      isValid = false;
    }
    if (!patient.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!patient.professional_id.trim()) {
      newErrors.professional_id = "Doctor assignment is required";
      isValid = false;
    }
    if (!patient.device_id.trim()) {
      newErrors.device_id = "Device assignment is required";
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

  // Get the device name for the assigned device (for display in edit mode)
  const assignedDevice = devices.find(
    (device) => device.deviceid === patient.device_id
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Patient" : "Add Patient"}
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
              value={patient.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={patient.dob}
              onChange={(e) => onChange("dob", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter the address"
              value={patient.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
              value={patient.contact_number}
              onChange={(e) => onChange("contact_number", e.target.value)}
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
              value={patient.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Professional Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign Doctor
            </label>
            <select
              value={patient.professional_id}
              onChange={(e) => onChange("professional_id", e.target.value)}
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
            {errors.professional_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.professional_id}
              </p>
            )}
          </div>

          {/* Device Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign Device
            </label>
            {isEdit ? (
              // Display device name as plain text in edit mode
              <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                {assignedDevice
                  ? assignedDevice.device_name
                  : "No device assigned"}
              </div>
            ) : (
              // Allow device selection in add mode
              <select
                value={patient.device_id}
                onChange={(e) => onChange("device_id", e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a device</option>
                {devices
                  .filter(
                    (device) =>
                      !device.is_assigned ||
                      device.deviceid === patient.device_id
                  )
                  .map((device) => (
                    <option key={device.deviceid} value={device.deviceid}>
                      {device.device_name}
                    </option>
                  ))}
              </select>
            )}
            {errors.device_id && (
              <p className="text-red-500 text-xs mt-1">{errors.device_id}</p>
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

export default PatientModal;
