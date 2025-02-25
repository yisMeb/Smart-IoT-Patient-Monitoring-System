import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Loader2, RefreshCw, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { fetchAssingnedPatients } from "../../../service/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Case from "../../../pages/protected/professionals/Case" 

interface Patient {
  patient_id: string
  name: string
  dob: string
  contact_number: string
  email: string
  device_id: string | null
}

export const AssignedPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [contactFilter, setContactFilter] = useState("")
  const [sensorFilter, setSensorFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const navigate = useNavigate()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAssingnedPatients(navigate)
      setPatients(data || [])
      setFilteredPatients(data || [])
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        patient.contact_number.includes(contactFilter) &&
        (sensorFilter === "all" ||
          (sensorFilter === "assigned" && patient.device_id !== null) ||
          (sensorFilter === "not-assigned" && patient.device_id === null)),
    )
    setFilteredPatients(filtered)
  }, [nameFilter, contactFilter, sensorFilter, patients])

  const handleRefresh = () => {
    fetchData()
  }

  if (error) return <div>Error: {error}</div>

  const CaseViewerButton = (patient: Patient) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={() => setSelectedPatient(patient)} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        {selectedPatient && <Case patient={selectedPatient} />}
      </SheetContent>
    </Sheet>
  )

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 mt-2 gap-2">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-8 w-full sm:w-[200px]"
              />
            </div>
            <Input
              placeholder="Filter by contact"
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
              className="w-full sm:w-[200px]"
            />
            <Select value={sensorFilter} onValueChange={setSensorFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by sensors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="not-assigned">Not assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRefresh} disabled={loading} variant="outline" size="icon" className="mt-2 sm:mt-0">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Sensors</TableHead>
                  <TableHead className="text-right">Case</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No patients match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.patient_id}>
                      <TableCell className="font-medium">
                        {patient.name} <br />
                        <span className="text-gray-400 font-normal">{patient.email}</span>
                      </TableCell>
                      <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.contact_number}</TableCell>
                      <TableCell>
                        <div
                          className={`font-bold w-fit p-1 rounded-md ${
                            patient.device_id ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {patient.device_id ? "Assigned" : "Not assigned"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{CaseViewerButton(patient)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

