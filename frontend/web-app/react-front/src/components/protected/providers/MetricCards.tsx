import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { fetchAllDevices, fetchAllPatient, fetchAllProfessionals } from '@/service/api';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
  value: string;
  label: string;
  change: number;
}

const MetricCard = ({ value, label, change }: MetricCardProps) => {
  const [count, setCount] = useState(0);
  const isPositive = change > 0;
  const numberValue = parseFloat(value.replace('%', ''));

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = numberValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCount((prev) => {
          const next = prev + stepValue;
          return next > numberValue ? numberValue : next;
        });
        currentStep++;
      } else {
        clearInterval(timer);
        setCount(numberValue);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numberValue]);

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
      <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12">
            <img src="/chart-simple-2.svg" alt="Metric Icon" className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-4xl font-semibold tabular-nums">
            {count.toFixed(value.includes('%') ? 1 : 0)}
            {value.includes('%') ? '%' : ''}
          </h3>
          <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700">{label}</p>
          <div
            className={`mt-2 text-sm flex items-center gap-1 ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export const MetricCards = () => {
  const [metrics, setMetrics] = useState<MetricCardProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const patients = (await fetchAllPatient(navigate)) || [];
        const patientCount = Array.isArray(patients) ? patients.length : 0;
  
        const professionals = (await fetchAllProfessionals(navigate)) || [];
        const professionalCount = Array.isArray(professionals) ? professionals.length : 0;
  
        const devices = (await fetchAllDevices(navigate)) || [];
        const deviceCount = Array.isArray(devices) ? devices.length : 0;
  
        const patient_previousCount = 1;
        const patient_change = ((patientCount - patient_previousCount) / patient_previousCount) * 100;
  
        const professional_previousCount = 1;
        const professional_change = ((professionalCount - professional_previousCount) / professional_previousCount) * 100;
  
        const device_previousCount = 1;
        const device_change = ((deviceCount - device_previousCount) / device_previousCount) * 100;
  
        setMetrics([
          { value: patientCount.toString(), label: 'Patients', change: parseFloat(patient_change.toFixed(1)) },
          { value: professionalCount.toString(), label: 'Professionals', change: parseFloat(professional_change.toFixed(1)) },
          { value: deviceCount.toString(), label: 'Devices', change: parseFloat(device_change.toFixed(1)) },
          { value: '72.4%', label: 'Alert Resolved', change: -0.647 },
          { value: '72.4%', label: 'New device', change: -0.647 },
        ]);
      } catch (error) {
        console.error('Failed to load metrics:', error);
      }
    };

    loadMetrics();
  }, [navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};
