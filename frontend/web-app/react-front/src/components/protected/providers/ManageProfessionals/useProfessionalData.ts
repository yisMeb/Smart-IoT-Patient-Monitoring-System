import { useEffect, useState } from "react";
import { fetchAllProfessionals } from "@/service/api";
import { useNavigate } from "react-router-dom";

interface Professional {
  professional_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string;
}

const useProfessionalData = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllProfessionals(navigate);
        setProfessionals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return { professionals, loading, error, setProfessionals, setError };
};

export default useProfessionalData;
