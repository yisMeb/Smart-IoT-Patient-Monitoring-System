import React from "react";

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
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              placeholder="Enter the date"
              value={patient.dob}
              onChange={(e) => onChange("dob", e.target.value)}
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
              value={patient.address}
              onChange={(e) => onChange("address", e.target.value)}
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
              value={patient.contact_number}
              onChange={(e) => onChange("contact_number", e.target.value)}
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
              value={patient.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
          </div>

          {/* Device Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign Device
            </label>
            <select
              value={patient.device_id}
              onChange={(e) => onChange("device_id", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a device</option>
              {devices
                .filter(
                  (device) =>
                    !device.is_assigned || device.deviceid === patient.device_id
                )
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={onSubmit}
          >
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
