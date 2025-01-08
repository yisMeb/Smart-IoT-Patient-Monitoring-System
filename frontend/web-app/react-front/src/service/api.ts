import { auth } from '@/lib/firebaseConfig';
import { getIdTokenFromCookies, isTokenExpired, getRoleFromCookies } from '../lib/cookieUtils';
import { useNavigate } from 'react-router-dom';

const ALL_PATIENT = import.meta.env.VITE_API_GET_ALL_PATIENTS as string;
const All_PROFESSIONALS = import.meta.env.VITE_API_GET_ALL_PROFESSIONALS as string;
const token = getIdTokenFromCookies();
const role = getRoleFromCookies();

export const fetchAllPatient = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    if (!role || !token || isTokenExpired(token)) {
      auth.signOut();
      navigate('/login');
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(ALL_PATIENT, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
};

export const fetchAllProfessionals = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    if (!role || !token || isTokenExpired(token)) {
      auth.signOut();
      navigate('/login');
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(All_PROFESSIONALS, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch professionals:', error);
    throw error;
  }
}