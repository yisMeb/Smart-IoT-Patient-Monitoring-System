import { CardChart } from '@/components/protected/professionals/CardCharts';
import { Navigation } from '@/components/protected/professionals/Navigations';
import { DataTable } from '@/components/protected/professionals/DataTable';
import { PatientHistoryChart } from '@/components/protected/professionals/PatientHistoryChart';

const ProfessionalDashboard = () => {
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
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto -mt-40">
        <div className="p-6 space-y-6">
            <CardChart/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 flex flex-col h-full">
              <div className="flex-grow">
               <DataTable/>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-1 flex flex-col h-full">
              <div className="flex-grow">
                <PatientHistoryChart/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
