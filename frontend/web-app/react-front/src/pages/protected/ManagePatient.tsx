import React, { useState } from 'react';
import { Navigation } from '../../components/protected/providers/Navigations';
import { Button } from '@/components/ui/button';

const ManagePatient: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddProfessional = () => {
        // Handle the logic for adding a professional
        console.log("Professional added");
        setIsModalOpen(false); // Close the modal after confirming
    };
    const patients = [
        {
            name: "Marta Kebede",
            email: "marta@gmail.com",
            dateofbirth: "Nov 9, 2024",
            address: "Gulele, Addis Ababa",
            contact: "+251911111111",
            image: "/thegirl.png"
        },
        {
            name: "Marta Kebede",
            email: "marta@gmail.com",
            dateofbirth: "Nov 9, 2024",
            address: "Gulele, Addis Ababa",
            contact: "+251911111111",
            image: "/thegirl.png"
        },
        {
            name: "Marta Kebede",
            email: "marta@gmail.com",
            dateofbirth: "Nov 9, 2024",
            address: "Gulele, Addis Ababa",
            contact: "+251911111111",
            image: "/thegirl.png"
        },
        // Add more patient objects as needed
    ];

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
                            <h1 className="text-2xl font-bold text-white">Patients</h1>
                            <Button className="px-4 py-2 bg-white rounded-lg text-gray-800 hover:bg-gray-100 hover:shadow-lg hover:scale-10" 
                            onClick={() => setIsModalOpen(true)}>
                                Add Patient
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

             {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <h2 className="text-xl font-bold mb-4">Add Patient</h2>
            
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter the name"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
            
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                            <input
                                                type="date"
                                                placeholder="Enter the date"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
            
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                placeholder="Enter the address you currently live in"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
            
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter the contact number"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
            
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                                            <textarea
                                                placeholder="Enter additional details"
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
            
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <Button
                                            className="px-20 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                            onClick={() => setIsModalOpen(false)} // Close the modal
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="px-20 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            onClick={handleAddProfessional} // Handle the confirm action
                                        >
                                            Confirm
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DETAILS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {patients.map((patient, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={patient.image} alt={patient.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                    <div className="text-sm text-gray-500">{patient.email}</div> {/* Add email here */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.dateofbirth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contact}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><button className="flex items-center px-4 py-2 bg-[#e5e7eb] text-[#71717a] rounded-lg hover:bg-slate-600 transition-colors">
                                                Edit
                                            </button></td>
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

export default ManagePatient;