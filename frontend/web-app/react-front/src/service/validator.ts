import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

export const validateName = (value: string): string => {
    if (!value.trim()) {
        return 'Name cannot be empty.';
    }
    if (!/^[A-Za-z\s.]+$/.test(value)) {
        return 'Name must contain only letters, spaces, and periods.';
    }
    return '';
};

export const validateSpecialization = (value: string): string => {
    if (!value.trim()) {
        return 'Specialization cannot be empty.';
    }
    return '';
};

export const validateContactNumber = (value: string, countryCode: CountryCode = 'ET'): string => {
    if (!value.trim()) {
        return 'Contact number cannot be empty.';
    }
    if (!isValidPhoneNumber(value, countryCode)) {
        return 'Please enter a valid phone number.';
    }
    return '';
};

export const validateEmail = (email: string): string => {
    if (!email.trim()) {
        return "Email cannot be empty.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email address.";
  };
  

export const validateAddress = (value: string): string => {
    if (!value.trim()) {
        return 'Address cannot be empty.';
    }
    return '';
};
