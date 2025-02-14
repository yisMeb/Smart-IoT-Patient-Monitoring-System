"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Phone, Mail, User, Heart, Thermometer, Wind } from "lucide-react"
import type React from "react"

interface Patient {
  patient_id: string
  name: string
  dob: string
  contact_number: string
  email: string
  device_id: string | null
}

interface CaseProps {
  patient: Patient
}

interface TimelineEntry {
  date: string
  notes: string
}

// Mock data - replace with API call later
const timelineData: TimelineEntry[] = [
  {
    date: "Jan 9, 2025",
    notes: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
  {
    date: "Nov 9, 2024",
    notes: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
  {
    date: "Nov 5, 2024",
    notes: "Have been checking up by the checkup time provided. have been checking up by the checkup time provided.",
  },
]

const Case: React.FC<CaseProps> = ({ patient }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        {/* Patient Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold">{patient.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {patient.contact_number}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {patient.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Addis ababa, Ethiopia
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-3xl font-bold">34</div>
                    <div className="text-sm text-muted-foreground">Years old</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">2024</div>
                    <div className="text-sm text-muted-foreground">assigned to me</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Timeline</h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-8">
                {timelineData.map((entry, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-muted">
                    <div className="absolute left-0 w-2 h-2 rounded-full bg-primary -translate-x-[5px]" />
                    <div className="font-medium mb-1">{entry.date}</div>
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Thresholds */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Threshold</h3>
            <p className="text-sm text-muted-foreground">Individual Threshold</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <div>
                  <div className="font-medium">Heartbeat</div>
                  <div className="text-sm text-muted-foreground">bpm</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">60-80</div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">Oxygen level</div>
                  <div className="text-sm text-muted-foreground">spO2</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">95-100</div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="font-medium">Temperature</div>
                  <div className="text-sm text-muted-foreground">°C</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">32-36</div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>        
      </div>
    </div>
  )
}

export default Case

