import React, { useEffect, useState } from "react";
import { User, Mail, MapPin, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/protected/providers/Navigations";
import { fetchInstitutionByID, updateProviders } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { validateName, validateAddress, validateEmail } from "../../service/validator";
import { Toaster, toast } from "sonner";

const Profile: React.FC = () => {
  const [institution, setInstitution] = useState({
    id: "",
    name: "",
    address: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalInstitution, setOriginalInstitution] = useState<typeof institution | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    address: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInstitutionByID(navigate);
        if (data) {
          const institutionData = {
            id: data.institution_id,
            name: data.name,
            address: data.address,
            email: data.email,
          };
          setInstitution(institutionData);
          setOriginalInstitution(institutionData);
        }
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInstitution((prev) => ({ ...prev, [name]: value }));
  
    let error = "";
    if (name === "name") error = validateName(value);
    else if (name === "address") error = validateAddress(value);
    else if (name === "email") error = validateEmail(value);
  
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };
  

  const isSaveDisabled =
    JSON.stringify(institution) === JSON.stringify(originalInstitution) ||
    Object.values(validationErrors).some((error) => error) ||
    !institution.name.trim() ||
    !institution.address.trim() ||
    !institution.email.trim();
 
  const handleSaveChanges = async () => {
    setIsSaving(true);

    const nameError = validateName(institution.name);
    const addressError = validateAddress(institution.address);
    const emailError = validateEmail(institution.email);

    if (nameError || addressError || emailError) {
      setValidationErrors({
        name: nameError,
        address: addressError,
        email: emailError,
      });
      setIsSaving(false);
      return;
    }

    try {
      const response = await updateProviders(navigate, institution.id, {
        name: institution.name,
        address: institution.address,
        email: institution.email,
      });
      if (response?.message) {
        toast.success("Profile updated successfully");
        setOriginalInstitution(institution);
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Failed to save changes:", error);
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
          backgroundPosition: "center"
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
                  <h3 className="text-3xl font-semibold tabular-nums">
                    {institution.name}
                  </h3>
                  <div className="flex flex-row gap-3">
                    <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                      <span className="flex flex-row gap-2 text-center">
                        <MapPin /> {institution.address}
                      </span>
                    </p>
                    <p className="text-gray-500 mt-1 transition-colors duration-300 group-hover:text-gray-700">
                      <span className="flex flex-row gap-2 text-center">
                        <Mail /> {institution.email}
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
                        name="name"
                        value={institution.name}
                        onChange={handleInputChange}
                        className="w-72"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                    <div className="mt-5">
                      <label htmlFor="email">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={institution.email}
                        onChange={handleInputChange}
                        className="w-72"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    <div className="mt-5 mb-8">
                      <label htmlFor="address">Address</label>
                      <Input
                        type="text"
                        name="address"
                        value={institution.address}
                        onChange={handleInputChange}
                        className="w-72"
                      />
                      {validationErrors.address && (
                        <p className="text-red-500 mt-1">{validationErrors.address}</p>
                      )}
                    </div>

                    <hr />
                    <div className="mt-5 flex flex-row justify-end w-full">
                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        disabled={isSaveDisabled || isSaving}
                        onClick={handleSaveChanges}
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

export default Profile;
