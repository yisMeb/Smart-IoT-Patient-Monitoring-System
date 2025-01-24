import { auth } from "@/lib/firebaseConfig";
import {
  getIdTokenFromCookies,
  isTokenExpired,
  getRoleFromCookies,
} from "../lib/cookieUtils";
import { useNavigate } from "react-router-dom";
import { body } from "framer-motion/client";

const ALL_PATIENT = import.meta.env.VITE_API_GET_ALL_PATIENTS as string;
const ADD_PATIENT = import.meta.env.VITE_API_ADD_PATIENT as string;
const UPDATE_PATIENT = import.meta.env.VITE_API_UPDATE_PATIENT as string;

const All_PROFESSIONALS = import.meta.env
  .VITE_API_GET_ALL_PROFESSIONALS as string;
const UPDATE_PROFESSIONAL = import.meta.env
  .VITE_API_UPDATE_PROFESSIONAL as string;
const ADD_PROFESSIONAL = import.meta.env.VITE_API_ADD_PROFESSIONAL as string;

const ALL_DEVICES = import.meta.env.VITE_API_GET_ALL_DEVICES as string;
const ADD_DEVICE = import.meta.env.VITE_API_ADD_DEVICE as string;
const UPDATE_DEVICE = import.meta.env.VITE_API_UPDATE_DEVICE as string;

const token = getIdTokenFromCookies();
//const role = getRoleFromCookies();
//const roleSpecificId = getRoleIDFromCookie();
interface Professional {
  professional_id: string;
  institution_id: string;
  name: string;
  specialization: string;
  contact_number: string;
  email: string;
  created_at: string;
}

interface Patient {
  patient_id: string;
  institution_id: string;
  name: string;
  dob: string;
  contact_number: string;
  email: string;
  address: string;
  created_at: string;
  device_id: string;
  status: string;
  oxygen_threshold?: number;
  heartrate_threshold?: number;
  temperature_threshold?: number;
  oxygen_threshold_lower?: number;
  heartrate_threshold_lower?: number;
  temperature_threshold_lower?: number;
  professional_id: string;
}

interface Device {
  deviceid: string;
  device_name: string;
  is_assigned: boolean;
  assigned_to: string;
}

const checkAuthAndGetHeaders = (navigate: ReturnType<typeof useNavigate>) => {
  const token = getIdTokenFromCookies();
  const role = getRoleFromCookies();

  if (!role || !token || isTokenExpired(token)) {
    auth.signOut();
    navigate("/login");
    return null;
  }

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    token,
  };
};

export const fetchAllPatient = async (
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(ALL_PATIENT, {
      method: "GET",
      headers: auth.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw error;
  }
};

export const fetchAllProfessionals = async (
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(All_PROFESSIONALS, {
      method: "GET",
      headers: auth.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch professionals:", error);
    throw error;
  }
};

export const fetchAllDevices = async (
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(ALL_DEVICES, {
      method: "GET",
      headers: auth.headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    throw error;
  }
};

export const updateProfessional = async (
  navigate: ReturnType<typeof useNavigate>,
  professionalId: string,
  updates: Partial<Professional>
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(`${UPDATE_PROFESSIONAL}/${professionalId}`, {
      method: "PUT",
      headers: auth.headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update professional:", error);
    throw error;
  }
};

export const addProfessional = async (
  navigate: ReturnType<typeof useNavigate>,
  professional: {
    name: string;
    specialization: string;
    contact_number: string;
    email: string;
  }
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(`${ADD_PROFESSIONAL}`, {
      method: "POST",
      headers: auth.headers,
      body: JSON.stringify(professional),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add professional:", error);
    throw error;
  }
};

export const updatePatient = async (
  navigate: ReturnType<typeof useNavigate>,
  patientID: string,
  updates: Partial<Patient>
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;
    console.log(updates);
    const response = await fetch(`${UPDATE_PATIENT}/${patientID}`, {
      method: "PUT",
      headers: auth.headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update Patient:", error);
    throw error;
  }
};

export const addPatient = async (
  navigate: ReturnType<typeof useNavigate>,
  patient: {
    name: string;
    dob: string;
    contact_number: string;
    email: string;
    status: string;
    address: string;
    professional_id: string;
    institution_id: string;
    device_id?: string;
    oxygen_threshold?: number;
    heartrate_threshold?: number;
    temperature_threshold?: number;
    oxygen_threshold_lower?: number;
    heartrate_threshold_lower?: number;
    temperature_threshold_lower?: number;
  }
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;
    const patientData = {
      ...patient,
      device_id: patient.device_id || null,
      oxygen_threshold: patient.oxygen_threshold || 0,
      heartrate_threshold: patient.heartrate_threshold || 0,
      temperature_threshold: patient.temperature_threshold || 0,
      oxygen_threshold_lower: patient.oxygen_threshold_lower || 0,
      heartrate_threshold_lower: patient.heartrate_threshold_lower || 0,
      temperature_threshold_lower: patient.temperature_threshold_lower || 0,
    };
    console.log(patientData);
    const response = await fetch(`${ADD_PATIENT}`, {
      method: "POST",
      headers: auth.headers,
      body: JSON.stringify(patient),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add Patient:", error);
    throw error;
  }
};

export const updateDevice = async (
  deviceid: string,
  updates: Partial<Device> // Partial allows updating only specific fields
) => {
  try {
    const response = await fetch(`${UPDATE_DEVICE}/${deviceid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates), // Send the updates in the correct format
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update device:", error);
    throw error;
  }
};

export const addDevice = async (device: {
  device_name: string;
  is_assigned: boolean;
  assigned_to: string;
}) => {
  try {
    console.log(device);
    const response = await fetch(`${ADD_DEVICE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(device),
    });
    console.log(body);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add device:", error);
    throw error;
  }
};
