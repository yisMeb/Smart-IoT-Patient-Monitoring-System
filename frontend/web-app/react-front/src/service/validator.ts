import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

/**
 * Validates the name field.
 * @param value - The name input.
 * @returns Error message if invalid, otherwise an empty string.
 */
export const validateName = (value: string): string => {
    if (!value.trim()) {
        return 'Name cannot be empty.';
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
        return 'Name must contain only letters and spaces.';
    }
    return '';
};

/**
 * Validates the specialization field.
 * @param value - The specialization input.
 * @returns Error message if invalid, otherwise an empty string.
 */
export const validateSpecialization = (value: string): string => {
    if (!value.trim()) {
        return 'Specialization cannot be empty.';
    }
    return '';
};

/**
 * Validates the contact number field using libphonenumber-js.
 * @param value - The contact number input.
 * @param countryCode - The country code for validation.
 * @returns Error message if invalid, otherwise an empty string.
 */
export const validateContactNumber = (value: string, countryCode: CountryCode = 'ET'): string => {
    if (!value.trim()) {
        return 'Contact number cannot be empty.';
    }
    if (!isValidPhoneNumber(value, countryCode)) {
        return 'Please enter a valid phone number.';
    }
    return '';
};

/**
 * Validates the address field.
 * @param value - The address input.
 * @returns Error message if invalid, otherwise an empty string.
 */
export const validateAddress = (value: string): string => {
    if (!value.trim()) {
        return 'Address cannot be empty.';
    }
    return '';
};
