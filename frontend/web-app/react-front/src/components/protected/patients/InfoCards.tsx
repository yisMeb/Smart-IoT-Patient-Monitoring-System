import React from 'react'
import { Heart, Thermometer, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface MetricProps {
  icon: React.ReactNode
  label: string
  unit: string
  value: string
}

const Metric = ({ icon, label, value, unit }: MetricProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span className="text-blue-500">{icon}</span>
      <div className='flex flex-col'>
        <span className="text-muted-foreground">{label}</span>
        <span className='text-gray-400 font-thin text-sm'>{unit}</span>
      </div>
    </div>
    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
  </div>
)

interface InfoCardProps {
  title: string
  subtitle: string
  metrics: Array<{
    label: string
    unit: string
    value: string
    icon: React.ReactNode
  }>
}

const InfoCard = ({ title, subtitle, metrics }: InfoCardProps) => (
  <Card className="w-full max-w-xs">
    <CardHeader>
      <CardTitle className="text-base font-medium">{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-1">
      {metrics.map((metric, index) => (
        <Metric
          key={index}
          icon={metric.icon}
          label={metric.label}
          unit={metric.unit}
          value={metric.value}
        />
      ))}
    </CardContent>
  </Card>
)

export default function InfoCards() {
  const cards = [
    {
      title: 'Threshold',
      subtitle: 'Individual threshold',
      metrics: [
        {
          label: 'Heartbeat',
          unit: 'bpm',
          value: '60-100',
          icon: <Heart className="h-4 w-4" color='#f1416c' />
        },
        {
          label: 'Oxygen level',
          unit: 'spO2',
          value: '95-100',
          icon: <Activity className="h-4 w-4" color='#f1416c'/>
        },
        {
          label: 'Temperature',
          unit: '°C',
          value: '32-36',
          icon: <Thermometer className="h-4 w-4" color='#f1416c'/>
        }
      ]
    },
    {
      title: 'Device log',
      subtitle: 'Current device log',
      metrics: [
        {
          label: 'Heartbeat ',
          unit: 'bpm',
          value: '85',
          icon: <Heart className="h-4 w-4" color='#f1416c'/>
        },
        {
          label: 'Oxygen level',
          unit: 'spO2',
          value: '98',
          icon: <Activity className="h-4 w-4" color='#f1416c'/>
        },
        {
          label: 'Temperature',
          unit: '°C',
          value: '36',
          icon: <Thermometer className="h-4 w-4" color='#f1416c'/>
        }
      ]
    }
  ]

  return (
    <div className="flex gap-5">
      {cards.map((card, index) => (
        <InfoCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          metrics={card.metrics}
        />
      ))}
    </div>
  )
}
