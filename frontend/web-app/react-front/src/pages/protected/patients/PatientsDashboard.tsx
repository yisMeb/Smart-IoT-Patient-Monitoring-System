import { NavBar } from '@/components/protected/patients/NavBar';
import InfoCards from '@/components/protected/patients/InfoCards';
import Notifications from '@/components/protected/patients/Notification';
import History from '@/components/protected/patients/History';

const PatientsDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section */}
      <div
        className="pb-32 mx-auto"
        style={{
          backgroundImage: 'url("/Background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
       <div className="max-w-screen-lg mx-auto">
            <NavBar />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                </div>
            </div>
        </div>
    </div>

      {/* Main Content */}
      <div className="-mt-24 max-w-screen-xl mx-auto">
        <div className="flex flex-wrap justify-center gap-5">
          <div className="basis-2/3 md:basis-2/3 xl:basis-1/2 lg:mx-4">
              <InfoCards/>
            <div className='mt-5'>
                <Notifications />
            </div>
          </div>

          <div className="basis-1/3 md:basis-1/3 xl:basis-1/3">
            <History />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsDashboard;
