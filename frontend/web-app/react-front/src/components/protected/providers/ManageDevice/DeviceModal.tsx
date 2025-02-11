import React from "react";

interface DeviceModalProps {
  isEdit: boolean;
  device: { device_name: string; is_assigned: boolean };
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: string, value: string | boolean) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  isEdit,
  device,
  onClose,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Device" : "Add New Device"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device Name
            </label>
            <input
              type="text"
              placeholder="Enter the device name"
              value={device.device_name}
              onChange={(e) => onChange("device_name", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Assigned
              </label>
              <div className="mt-1">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={device.is_assigned}
                    onChange={(e) => onChange("is_assigned", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-900">
                    {device.is_assigned ? "Assigned" : "Unassigned"}
                  </span>
                </label>
              </div>
            </div>
          )}
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

export default DeviceModal;
