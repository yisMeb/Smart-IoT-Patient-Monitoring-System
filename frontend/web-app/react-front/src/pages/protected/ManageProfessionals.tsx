import React from 'react';
import { Navigation } from '../../components/protected/providers/Navigations';


const ManageProfessionals: React.FC = () => {
    return (
        <div className='bg-blue-600 h-screen'>
            <Navigation />
            <h1>Manage Professionals</h1>
            <p>This is the Manage Professionals page.</p>
        </div>
    );
};

export default ManageProfessionals;