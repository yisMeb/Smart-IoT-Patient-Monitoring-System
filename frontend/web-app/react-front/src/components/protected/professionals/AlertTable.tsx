import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchPatientAlertTable, toggle_alert_resolved } from "../../../service/api" // Adjust the import path as needed
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type Alert = {
  id: number
  message: string
  name: string
  contact_number: string
  timestamp: string
  is_resolved: boolean
}

export const AlertTable = () => {
  const [data, setData] = useState<Alert[]>([])
  const [filteredData, setFilteredData] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const [togglingAlerts, setTogglingAlerts] = useState<Record<number, boolean>>({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchPatientAlertTable(navigate)
      console.log("Fetched data:", response)

      if (Array.isArray(response)) {
        setData(response)
        setFilteredData(response)
      } else {
        console.error("Unexpected response format:", response)
        setError("Unexpected data format received from the server")
        setData([])
        setFilteredData([])
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const filtered = data.filter((alert) => alert.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, data])

  const handleRefresh = () => {
    fetchData()
  }

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <span className="text-xl font-semibold">Patient Alerts</span>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Alert</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">
                          {row.name} <br />
                          <span className="text-gray-400 font-normal">{row.contact_number}</span>
                        </TableCell>
                        <TableCell>{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>{row.message}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Switch
                                checked={row.is_resolved}
                                onCheckedChange={async () => {
                                  try {
                                    setTogglingAlerts((prev) => ({ ...prev, [row.id]: true }))
                                    await toggle_alert_resolved(navigate, row.id.toString())
                                    await fetchData()
                                  } catch (error) {
                                    console.error("Failed to toggle alert:", error)
                                  } finally {
                                    setTogglingAlerts((prev) => ({ ...prev, [row.id]: false }))
                                  }
                                }}
                                disabled={togglingAlerts[row.id]}
                              />
                              {togglingAlerts[row.id] && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                              )}
                            </div>
                            <span className="ml-2">{row.is_resolved ? "Resolved" : "Unresolved"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No patient alerts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input
                  className="w-14 text-center"
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number.parseInt(e.target.value)
                    setCurrentPage(page ? Math.min(Math.max(page, 1), totalPages) : 1)
                  }}
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

