import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { StatusBreakdown } from '../../../types/dashboard';

const DonutChart = ({ data, title, total }: { 
  data: { name: string; value: number; color: string; }[];
  title: string;
  total: number;
}) => (
  <div className={`bg-white rounded-xl p-3 shadow-sm flex items-center justify-between`}>
    <div className="flex-1 flex flex-col items-start">
      <h1 className="text-lg font-semibold mb-1">{total}</h1> 
      <p className="text-gray-500 mb-1 text-xs">Total {title}</p>
      
      <div className="h-[130px] w-full"> 
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="80%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={500}
              blendStroke
              cornerRadius={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={3}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="flex-none ml-4 mt-2 space-y-1 text-xs">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-4 h-1 rounded-full mr-2" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-gray-600">{item.name}</span>
          </div>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const StatusCharts = () => {
  // API call
  const patientData: StatusBreakdown = {
    total: 237,
    active: 26,
    inactive: 48,
    inProgress: 20
  };

  const deviceData: StatusBreakdown = {
    total: 237,
    active: 26,
    inactive: 48,
    inProgress: 15
  };

  const chartData = (data: StatusBreakdown) => [
    { name: 'Active', value: data.active, color: '#00A3FF' },
    { name: 'Inactive', value: data.inactive, color: '#50CD89' },
    { name: 'In Progress', value: data.inProgress, color: '#E4E6EF' },
  ];

  return (
    <div className="flex flex-col gap-4 max-h-[570px] overflow-hidden">
      <DonutChart 
        data={chartData(patientData)} 
        title="Patients" 
        total={patientData.total} 
      />
      <DonutChart 
        data={chartData(deviceData)} 
        title="Devices" 
        total={deviceData.total} 
      />
    </div>
  );
};
