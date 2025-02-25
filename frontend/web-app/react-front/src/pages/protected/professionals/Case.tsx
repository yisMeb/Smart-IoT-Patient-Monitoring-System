"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Mail, User, Cpu, Heart, Wind, Thermometer } from "lucide-react"
import { fetchCase, fetchPatientTreshold, updatePatientThreshold } from "../../../service/api"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader } from "lucide-react"

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

const Case: React.FC<CaseProps> = ({ patient }) => {
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([])
  const [thresholds, setThresholds] = useState({
    Hearthrate: "-",
    Oxygene: "-",
    Temperature: "-",
  })
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null)
  const [thresholdInputs, setThresholdInputs] = useState<{ [key: string]: { lower: string; upper: string } }>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [isTimelineLoading, setIsTimelineLoading] = useState(true)
  const [isThresholdsLoading, setIsThresholdsLoading] = useState(true)
  const [loadingThresholds, setLoadingThresholds] = useState<{ [key: string]: boolean }>({
    Hearthrate: false,
    Oxygene: false,
    Temperature: false,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const loadCaseData = async () => {
      setIsTimelineLoading(true)
      try {
        const cases = await fetchCase(navigate, patient.patient_id)
        if (cases && cases.length > 0) {
          const formattedData = cases.map((c: { timestamp: string; remark: string }) => ({
            date: new Date(c.timestamp).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            notes: c.remark,
          }))
          setTimelineData(formattedData)
        } else {
          setTimelineData([])
        }
      } catch (error) {
        console.error("Error fetching case data:", error)
      } finally {
        setIsTimelineLoading(false)
      }
    }
    loadCaseData()
  }, [navigate, patient.patient_id])

  useEffect(() => {
    const loadThresholds = async () => {
      setIsThresholdsLoading(true)
      setIsRefreshing(true)
      try {

        const data = await fetchPatientTreshold(navigate, patient.patient_id)
        setThresholds(data)
      } catch (error) {
        console.error("Error fetching patient thresholds:", error)
      } finally {
        setIsThresholdsLoading(false)
        setIsRefreshing(false)
      }
    }
    loadThresholds()
  }, [navigate, patient.patient_id])

  const handleSaveThreshold = async (key: string) => {
    setLoadingThresholds((prev) => ({ ...prev, [key]: true }));
  
    try {
      const thresholdData: { [key: string]: number | undefined } = {};
  
      if (key === "Hearthrate" && thresholdInputs["Hearthrate"]) {
        thresholdData.heartrate_threshold_lower = Number.parseFloat(thresholdInputs["Hearthrate"].lower);
        thresholdData.heartrate_threshold = Number.parseFloat(thresholdInputs["Hearthrate"].upper);
      }
      if (key === "Oxygene" && thresholdInputs["Oxygene"]) {
        thresholdData.oxygen_threshold_lower = Number.parseFloat(thresholdInputs["Oxygene"].lower);
        thresholdData.oxygen_threshold = Number.parseFloat(thresholdInputs["Oxygene"].upper);
      }
      if (key === "Temperature" && thresholdInputs["Temperature"]) {
        thresholdData.temperature_threshold_lower = Number.parseFloat(thresholdInputs["Temperature"].lower);
        thresholdData.temperature_threshold = Number.parseFloat(thresholdInputs["Temperature"].upper);
      }
  
      await updatePatientThreshold(navigate, patient.patient_id, thresholdData);

      setEditingThreshold(null);
    } catch (error) {
      console.error("Error updating threshold:", error);
    } finally {
      const updatedThresholds = await fetchPatientTreshold(navigate, patient.patient_id);
      setThresholds(updatedThresholds);
      window.location.reload()
      setThresholdInputs((prev) => ({
        ...prev,
        [key]: { 
          lower: updatedThresholds[key]?.split("-")[0]?.trim() || "",
          upper: updatedThresholds[key]?.split("-")[1]?.trim() || ""
        }
      }));
      setLoadingThresholds((prev) => ({ ...prev, [key]: false }));
    }
  };
  

  const handleEditClick = (key: string, value: string) => {
    const [lower, upper] = value.split("-").map((v) => v.trim())
    setEditingThreshold(key)
    setThresholdInputs((prev) => ({
      ...prev,
      [key]: { lower: lower || "", upper: upper || "" },
    }))
  }
  const handleInputChange = (key: string, field: "lower" | "upper", value: string) => {
    setThresholdInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                  <a className="flex items-center gap-1 text-green-700" href={`tel:${patient.contact_number}`}>
                    <Phone className="w-4 h-4" />
                    {patient.contact_number}
                  </a>
                  <a className="flex items-center gap-1 text-blue-500" href={`mailto:${patient.email}`}>
                    <Mail className="w-4 h-4" />
                    {patient.email}
                  </a>
                  <div className="flex items-center gap-1 border p-1 rounded-xl shadow-sm">
                    <Cpu className="w-4 h-4" />
                    {patient.device_id ? "Device Assigned" : "Device Not Assigned"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline  */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Timeline</h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {isTimelineLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {timelineData.length > 0 ? (
                    timelineData.map((entry, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-muted">
                        <div className="absolute left-0 w-2 h-2 rounded-full bg-primary -translate-x-[5px]" />
                        <div className="font-medium mb-1">{entry.date}</div>
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No case history available.</p>
                  )}
                </div>
              )}
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
            {isThresholdsLoading || isRefreshing ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              Object.entries(thresholds).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {key === "Hearthrate" && <Heart className="w-5 h-5 text-rose-500" />}
                    {key === "Oxygene" && <Wind className="w-5 h-5 text-blue-500" />}
                    {key === "Temperature" && <Thermometer className="w-5 h-5 text-amber-500" />}
                    <div>
                      <div className="font-medium">{key}</div>
                      <div className="text-sm text-muted-foreground">
                        {key === "Temperature" ? "°C" : key === "Oxygene" ? "spO2" : "bpm"}
                      </div>
                    </div>
                  </div>
                  {editingThreshold === key ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-16 border p-1 rounded-md text-sm"
                        placeholder="Lower"
                        value={thresholdInputs[key]?.lower || ""}
                        onChange={(e) => handleInputChange(key, "lower", e.target.value)}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        className="w-16 border p-1 rounded-md text-sm"
                        placeholder="Upper"
                        value={thresholdInputs[key]?.upper || ""}
                        onChange={(e) => handleInputChange(key, "upper", e.target.value)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveThreshold(key)}
                        disabled={loadingThresholds[key]}
                      >
                        {loadingThresholds[key] ? <Loader className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{value}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(key, value)}
                        disabled={loadingThresholds[key]}
                      >
                        {loadingThresholds[key] ? <Loader className="w-4 h-4 animate-spin" /> : "Update"}
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Case

