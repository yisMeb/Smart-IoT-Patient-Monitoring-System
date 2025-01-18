import { auth } from "@/lib/firebaseConfig";
import {
  getIdTokenFromCookies,
  isTokenExpired,
  getRoleFromCookies,
} from "../lib/cookieUtils";
import { useNavigate } from "react-router-dom";

const ALL_PATIENT = import.meta.env.VITE_API_GET_ALL_PATIENTS as string;
const All_PROFESSIONALS = import.meta.env.VITE_API_GET_ALL_PROFESSIONALS as string;
const ALL_DEVICES = import.meta.env.VITE_API_GET_ALL_DEVICES as string;
const UPDATE_PROFESSIONAL = import.meta.env.VITE_API_UPDATE_PROFESSIONAL as string;
const ADD_PROFESSIONAL = import.meta.env.VITE_API_ADD_PROFESSIONAL as string;

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
  institution_id: string;
  name: string;
  dob: string;
  contact_number: string;
  email: string;
  status: string;
  address: string;
  device_id: string;
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

export const fetchAllPatient = async (navigate: ReturnType<typeof useNavigate>) => {
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

export const fetchAllProfessionals = async (navigate: ReturnType<typeof useNavigate>) => {
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

export const fetchAllDevices = async (navigate: ReturnType<typeof useNavigate>) => {
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
    console.error("Failed to fetch professionals:", error);
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
  professionalId: string,
  updates: Partial<Patient>
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
    device_id: string;
  }
) => {
  try {
    const auth = checkAuthAndGetHeaders(navigate);
    if (!auth) return;

    const response = await fetch(`${ADD_PROFESSIONAL}`, {
      method: "POST",
      headers: auth.headers,
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add Patient:", error);
    throw error;
  }
};