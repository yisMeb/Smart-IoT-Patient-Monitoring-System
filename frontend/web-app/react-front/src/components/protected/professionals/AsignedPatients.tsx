import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Loader2, RefreshCw, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { fetchAssingnedPatients } from "../../../service/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Patient {
  patient_id: string
  name: string
  dob: string
  contact_number: string
  email: string
  sensors: "Assigned" | "Not Assigned"
}

export const AssignedPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nameFilter, setNameFilter] = useState("")
  const [contactFilter, setContactFilter] = useState("")
  const [sensorFilter, setSensorFilter] = useState("all")
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
        (sensorFilter === "all" || patient.sensors.toLowerCase().replace(" ", "-") === sensorFilter),
    )
    setFilteredPatients(filtered)
  }, [nameFilter, contactFilter, sensorFilter, patients])

  const handleRefresh = () => {
    fetchData()
  }

  if (error) return <div>Error: {error}</div>

  const CaseViewerButton= ()=> {
    alert("Case Viewer Button Clicked")
  }

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4 mt-2">
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Input
              placeholder="Filter by contact"
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
              className="w-[200px]"
            />
            <Select value={sensorFilter} onValueChange={setSensorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by sensors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="not-assigned">Not Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRefresh} disabled={loading} variant="outline" size="icon">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                    <TableCell className="text-right">
                      <div
                        className={`font-bold w-fit p-1 rounded-md ${
                          patient.sensors === "Assigned" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {patient.sensors}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <button onClick={CaseViewerButton} className="text-[#aeb2c1] border rounded-md bg-[#e5e6e9]">
                        <ChevronRight size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

