import React from 'react';
import { Navigation } from '../../components/protected/providers/Navigations';


const ManageDevices: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
      <div
        className="pb-48"
        style={{
          backgroundImage: 'url("/Background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-screen-lg mx-auto">
          <Navigation />

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Devices</h1>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto -mt-40">
        <div className="p-6 space-y-6">
          
        </div>
      </div>
    </div>
    );
};

export default ManageDevices;