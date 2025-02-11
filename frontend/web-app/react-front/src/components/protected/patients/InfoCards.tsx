import React, { useEffect, useState } from 'react';
import { Heart, Thermometer, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { fetchPatientTreshold, fetchNewHealthData, fetchPatient_BY_ID } from '../../../service/api';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: string;
}

const Metric: React.FC<MetricProps> = ({ icon, label, value, unit }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      <div className="flex flex-col">
        <span className="text-muted-foreground">{label}</span>
        <span className='text-gray-400 font-thin text-sm'>{unit}</span>
      </div>
    </div>
    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
);

interface InfoCardProps {
  title: string;
  subtitle: string;
  metrics: MetricProps[];
}

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, metrics }) => (
  <Card className="w-full max-w-xs">
    <CardHeader>
      <CardTitle className="text-base font-medium">{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-1">
      {metrics.map((metric, index) => (
        <Metric key={index} {...metric} />
      ))}
    </CardContent>
  </Card>
);

export default function InfoCards() {
  const navigate = useNavigate();
  const [thresholds, setThresholds] = useState<MetricProps[]>([]);
  const [deviceLog, setDeviceLog] = useState<MetricProps[]>([]);

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const response = await fetchPatientTreshold(navigate);
        setThresholds([
          { label: 'Heartbeat', unit: 'bpm', value: response.Hearthrate, icon: <Heart className="h-4 w-4" color='#f1416c' /> },
          { label: 'Oxygen level', unit: 'spO2', value: response.Oxygene, icon: <Activity className="h-4 w-4" color='#f1416c' /> },
          { label: 'Temperature', unit: '°C', value: response.Temperature, icon: <Thermometer className="h-4 w-4" color='#f1416c' /> }
        ]);
      } catch (error) {
        console.error("Failed to fetch patient thresholds", error);
      }
    };

    const fetchDeviceLog = async () => {
      try {
        const patientData = await fetchPatient_BY_ID(navigate);
        const healthData = await fetchNewHealthData(navigate, patientData.device_id);
        console.log('data: ',healthData);
        console.log('IDDDD: ',patientData.device_id);
        setDeviceLog([
          { label: 'Heartbeat', unit: 'bpm', value: healthData.heartbeat, icon: <Heart className="h-4 w-4" color='#f1416c' /> },
          { label: 'Oxygen level', unit: 'spO2', value: healthData.oxygen, icon: <Activity className="h-4 w-4" color='#f1416c' /> },
          { label: 'Temperature', unit: '°C', value: healthData.temperature, icon: <Thermometer className="h-4 w-4" color='#f1416c' /> }
        ]);
      } catch (error) {
        console.error("Failed to fetch device log", error);
      }
    };

    fetchThresholds();
    fetchDeviceLog();
  }, [navigate]);

  const cards: InfoCardProps[] = [
    { title: 'Threshold', subtitle: 'Your thresholds', metrics: thresholds },
    { title: 'Device log', subtitle: 'Latest device log', metrics: deviceLog }
  ];

  return (
    <div className="flex gap-5">
      {cards.map((card, index) => (
        <InfoCard key={index} {...card} />
      ))}
    </div>
  );
}
