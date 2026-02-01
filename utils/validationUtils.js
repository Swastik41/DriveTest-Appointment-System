// Input Validation and Sanitization Utilities
// Add this file to your utils folder and use it in all controllers

const validator = require('validator');

/**
 * Validation helper object with common validation rules
 */
const validationRules = {
  // Username: alphanumeric, 3-20 characters
  username: (value) => {
    if (!value) return { valid: false, error: 'Username is required' };
    if (value.length < 3) return { valid: false, error: 'Username must be at least 3 characters' };
    if (value.length > 20) return { valid: false, error: 'Username must not exceed 20 characters' };
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    return { valid: true };
  },

  // Password: minimum 8 characters, must include uppercase, lowercase, number, special char
  password: (value) => {
    if (!value) return { valid: false, error: 'Password is required' };
    if (value.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
    if (value.length > 50) return { valid: false, error: 'Password must not exceed 50 characters' };
    
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    if (!hasUppercase) return { valid: false, error: 'Password must include an uppercase letter' };
    if (!hasLowercase) return { valid: false, error: 'Password must include a lowercase letter' };
    if (!hasNumber) return { valid: false, error: 'Password must include a number' };
    if (!hasSpecial) return { valid: false, error: 'Password must include a special character' };
    
    return { valid: true };
  },

  // Name: letters and spaces only, 2-50 characters
  name: (value) => {
    if (!value) return { valid: false, error: 'Name is required' };
    if (value.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
    if (value.length > 50) return { valid: false, error: 'Name must not exceed 50 characters' };
    if (!/^[a-zA-Z\s]+$/.test(value)) return { valid: false, error: 'Name can only contain letters and spaces' };
    return { valid: true };
  },

  // Age: number between 16 and 120
  age: (value) => {
    if (!value) return { valid: false, error: 'Age is required' };
    const age = parseInt(value);
    if (isNaN(age)) return { valid: false, error: 'Age must be a number' };
    if (age < 16) return { valid: false, error: 'You must be at least 16 years old' };
    if (age > 120) return { valid: false, error: 'Age must be realistic' };
    return { valid: true };
  },

  // License number: alphanumeric, 6-15 characters
  licenseNo: (value) => {
    if (!value) return { valid: false, error: 'License number is required' };
    if (value.length < 6) return { valid: false, error: 'License number is too short' };
    if (value.length > 15) return { valid: false, error: 'License number is too long' };
    if (!/^[a-zA-Z0-9]+$/.test(value)) return { valid: false, error: 'License number must be alphanumeric' };
    return { valid: true };
  },

  // Car make: letters and spaces only, max 50 characters
  carMake: (value) => {
    if (!value) return { valid: false, error: 'Car make is required' };
    if (value.length > 50) return { valid: false, error: 'Car make is too long' };
    if (!/^[a-zA-Z\s]+$/.test(value)) return { valid: false, error: 'Car make can only contain letters and spaces' };
    return { valid: true };
  },

  // Car model: alphanumeric and spaces, max 50 characters
  carModel: (value) => {
    if (!value) return { valid: false, error: 'Car model is required' };
    if (value.length > 50) return { valid: false, error: 'Car model is too long' };
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) return { valid: false, error: 'Car model must be alphanumeric' };
    return { valid: true };
  },

  // Car year: number between 1900 and current year
  carYear: (value) => {
    if (!value) return { valid: false, error: 'Car year is required' };
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    if (isNaN(year)) return { valid: false, error: 'Year must be a number' };
    if (year < 1900) return { valid: false, error: 'Year must be 1900 or later' };
    if (year > currentYear + 1) return { valid: false, error: 'Year cannot be in the future' };
    return { valid: true };
  },

  // License plate: alphanumeric and special chars, max 10 characters
  licensePlate: (value) => {
    if (!value) return { valid: false, error: 'License plate is required' };
    if (value.length > 10) return { valid: false, error: 'License plate is too long' };
    if (!/^[a-zA-Z0-9\-]*$/.test(value)) return { valid: false, error: 'License plate contains invalid characters' };
    return { valid: true };
  },

  // Date: YYYY-MM-DD format and not in the past
  date: (value) => {
    if (!value) return { valid: false, error: 'Date is required' };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
    
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return { valid: false, error: 'Date cannot be in the past' };
    if (selectedDate > new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)) {
      return { valid: false, error: 'Date cannot be more than 90 days in the future' };
    }
    
    return { valid: true };
  },

  // Time: HH:mm format
  time: (value) => {
    if (!value) return { valid: false, error: 'Time is required' };
    if (!/^\d{2}:\d{2}$/.test(value)) return { valid: false, error: 'Time must be in HH:mm format' };
    
    const [hours, minutes] = value.split(':').map(Number);
    if (hours < 0 || hours > 23) return { valid: false, error: 'Invalid hour' };
    if (minutes < 0 || minutes > 59) return { valid: false, error: 'Invalid minutes' };
    
    return { valid: true };
  },

  // User type: must be Admin, Driver, or Examiner
  userType: (value) => {
    if (!value) return { valid: false, error: 'User type is required' };
    if (!['Admin', 'Driver', 'Examiner'].includes(value)) {
      return { valid: false, error: 'Invalid user type' };
    }
    return { valid: true };
  }
};

/**
 * Input sanitization - removes potentially dangerous characters
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.trim(input).substring(0, 255); // Limit length
};

/**
 * Sanitize all form data
 */
const sanitizeFormData = (formData) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Validate signup data
 */
const validateSignupData = (data) => {
  const errors = {};

  const usernameValidation = validationRules.username(data.username);
  if (!usernameValidation.valid) errors.username = usernameValidation.error;

  const passwordValidation = validationRules.password(data.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;

  const userTypeValidation = validationRules.userType(data.userType);
  if (!userTypeValidation.valid) errors.userType = userTypeValidation.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate G2 test submission
 */
const validateG2Submission = (data) => {
  const errors = {};

  const firstNameValidation = validationRules.name(data.firstName);
  if (!firstNameValidation.valid) errors.firstName = firstNameValidation.error;

  const lastNameValidation = validationRules.name(data.lastName);
  if (!lastNameValidation.valid) errors.lastName = lastNameValidation.error;

  const ageValidation = validationRules.age(data.age);
  if (!ageValidation.valid) errors.age = ageValidation.error;

  const licenseNoValidation = validationRules.licenseNo(data.licenseNo);
  if (!licenseNoValidation.valid) errors.licenseNo = licenseNoValidation.error;

  // Validate car information
  if (data.car_information) {
    const carMakeValidation = validationRules.carMake(data.car_information.make);
    if (!carMakeValidation.valid) errors.carMake = carMakeValidation.error;

    const carModelValidation = validationRules.carModel(data.car_information.model);
    if (!carModelValidation.valid) errors.carModel = carModelValidation.error;

    const carYearValidation = validationRules.carYear(data.car_information.year);
    if (!carYearValidation.valid) errors.carYear = carYearValidation.error;

    const licensePlateValidation = validationRules.licensePlate(data.car_information.platNo);
    if (!licensePlateValidation.valid) errors.licensePlate = licensePlateValidation.error;
  }

  if (!data.appointmentId) {
    errors.appointment = 'Please select an appointment slot';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate appointment creation
 */
const validateAppointmentCreation = (data) => {
  const errors = {};

  const dateValidation = validationRules.date(data.date);
  if (!dateValidation.valid) errors.date = dateValidation.error;

  const timeValidation = validationRules.time(data.time);
  if (!timeValidation.valid) errors.time = timeValidation.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validationRules,
  sanitizeInput,
  sanitizeFormData,
  validateSignupData,
  validateG2Submission,
  validateAppointmentCreation
};
