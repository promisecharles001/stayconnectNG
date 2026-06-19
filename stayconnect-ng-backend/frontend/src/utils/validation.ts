/**
 * Shared validation & sanitization utilities
 * Used across forms to prevent XSS, injection, and invalid input.
 */

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // event handlers like onclick=
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  let cleaned = input;
  XSS_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '');
  });
  // Strip HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  return cleaned.trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '');
  // Supports +234... or 0...
  const phoneRegex = /^(\+234|0)[7-9][0-1][0-9]{8}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): string | null {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain an uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain a lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain a number';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain a special character';
  }
  return null;
}

/**
 * Validate that input is not empty and within length bounds
 */
export function validateRequired(input: string, fieldName: string, minLength = 1, maxLength = 200): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return `${fieldName} is required`;
  }
  if (trimmed.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (trimmed.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
}

/**
 * Validate numeric price input
 */
export function validatePrice(value: string): string | null {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return 'Please enter a valid price greater than 0';
  }
  if (num > 10000000) {
    return 'Price seems too high. Please verify.';
  }
  return null;
}

/**
 * Sanitize and validate search query
 */
export function sanitizeSearchQuery(query: string): string {
  return sanitizeInput(query).slice(0, 100);
}
