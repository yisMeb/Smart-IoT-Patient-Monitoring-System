import { Navigation } from '../../components/protected/providers/Navigations';
import { MetricCards } from '../../components/protected/providers/MetricCards';
import { PatientChart } from '../../components/protected/providers/PatientChart';
import { StatusCharts } from '../../components/protected/providers/StatusChart';

const ProviderDashboard = () => {
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
              <h1 className="text-2xl font-bold text-white">Healthcare Providers Dashboard</h1>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto -mt-40">
        <div className="p-6 space-y-6">
          <MetricCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 flex flex-col h-full">
              <div className="flex-grow">
                <PatientChart />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-1 flex flex-col h-full">
              <div className="flex-grow">
                <StatusCharts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
