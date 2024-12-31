export interface MetricCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    change: number;
  }
  
  export interface ChartData {
    month: string;
    value: number;
  }
  
  export interface DonutChartData {
    name: string;
    value: number;
    color: string;
  }
  
  export interface StatusBreakdown {
    total: number;
    active: number;
    inactive: number;
    inProgress: number;
  }
  
  