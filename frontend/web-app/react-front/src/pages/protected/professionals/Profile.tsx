import React, { useEffect, useState } from "react";
import { User, Mail, PhoneCall, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/protected/professionals/Navigations";
import { fetchProfessionalByID } from "../../../service/api";
import { updateProfessional } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import {
  validateName,
  validateSpecialization,
  validateContactNumber,
  validateAddress,
} from "../../../service/validator";
import { Toaster, toast } from "sonner"

const ProfileProfessionals: React.FC = () => {
  const [professional, setProfessional] = useState({
    professional_id: "",
    institution_id: "",
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
    created_at: "",
  });

  const [originalProfessional, setOriginalProfessional] = useState<typeof professional | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    specialization: "",
    contact_number: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfessionalData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProfessionalByID(navigate);
        if (data && data.length > 0) {
          setProfessional(data[0]);
          setOriginalProfessional(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch professional data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfessionalData();
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setProfessional((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    let errorMessage = "";
    switch (field) {
      case "name":
        errorMessage = validateName(value);
        break;
      case "specialization":
        errorMessage = validateSpecialization(value);
        break;
      case "contact_number":
        errorMessage = validateContactNumber(value, "ET");
        break;
      case "address":
        errorMessage = validateAddress(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const isSaveDisabled =
    JSON.stringify(professional) === JSON.stringify(originalProfessional) ||
    Object.values(errors).some((error) => error) ||
    Object.values(professional).some((value) => !value.trim());

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfessional(navigate, professional.professional_id, professional);
      setOriginalProfessional(professional);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update professional:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="pb-48"
        style={{
          backgroundImage: 'url("/Background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-screen-lg mx-auto">
          <Navigation />
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto -mt-40">
        <div className="p-6 space-y-6">
          <div className="relative bg-white rounded-xl p-6 transition-all duration-300 ease-out">
            <div className="h-screen text-gray-500 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12">
              <div className="flex justify-start items-center gap-3">
                <User size={100} />
                <section>
                  <h3 className="text-3xl font-semibold tabular-nums">{professional.name}</h3>
                  <div className="flex flex-row gap-3">
                    <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                      <span className="flex flex-row gap-2 text-center">
                        <Mail className="w-4 h-4" /> {professional.email}
                      </span>
                    </p>
                    <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                      <span className="flex flex-row gap-2 text-center">
                        <PhoneCall className="w-4 h-4" /> {professional.contact_number}
                      </span>
                    </p>
                  </div>
                </section>
              </div>

              <div className="flex flex-col mt-5">
                <h1 className="font-bold">Personal Info</h1>
                <span>Update your details here.</span>
                <div className="mt-5 max-w-screen-md">
                  <Card className="p-5">
                    <div className="mt-5">
                      <label htmlFor="name">Institution name</label>
                      <Input
                        type="text"
                        value={professional.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-72"
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mt-5">
                      <label htmlFor="email">Email</label>
                      <Input type="email" value={professional.email} readOnly className="w-72 bg-gray-100" />
                    </div>
                    <div className="mt-5">
                      <label htmlFor="specialization">Specialization</label>
                      <Input
                        type="text"
                        value={professional.specialization}
                        onChange={(e) => handleChange("specialization", e.target.value)}
                        className="w-72"
                      />
                      {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization}</p>}
                    </div>
                    <div className="mt-5 mb-8">
                      <label htmlFor="contact_number">Contact Number</label>
                      <Input
                        type="text"
                        value={professional.contact_number}
                        onChange={(e) => handleChange("contact_number", e.target.value)}
                        className="w-72"
                      />
                      {errors.contact_number && <p className="text-red-500 text-sm">{errors.contact_number}</p>}
                    </div>

                    <hr />
                    <div className="mt-5 flex flex-row justify-end w-full">
                      <Button
                        className={`bg-blue-500 text-white hover:bg-blue-600 ${isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSaveDisabled || isSaving}
                        onClick={handleSave}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfileProfessionals;
