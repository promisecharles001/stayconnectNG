/**
 * Unit tests for validation utilities
 * Run with: npm test
 */

import {
  sanitizeInput,
  isValidEmail,
  isValidNigerianPhone,
  validatePassword,
  validateRequired,
  validatePrice,
  sanitizeSearchQuery,
} from './validation';

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<b>hello</b>')).toBe('hello');
  });

  it('removes script tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('');
  });

  it('removes javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  it('removes event handlers', () => {
    expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });
});

describe('isValidEmail', () => {
  it('returns true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('returns false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

describe('isValidNigerianPhone', () => {
  it('returns true for valid Nigerian numbers', () => {
    expect(isValidNigerianPhone('+2348012345678')).toBe(true);
    expect(isValidNigerianPhone('08012345678')).toBe(true);
    expect(isValidNigerianPhone('08123456789')).toBe(true);
  });

  it('returns false for invalid numbers', () => {
    expect(isValidNigerianPhone('12345')).toBe(false);
    expect(isValidNigerianPhone('+12345678901')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('returns null for strong passwords', () => {
    expect(validatePassword('Strong1!')).toBeNull();
    expect(validatePassword('MyP@ssw0rd')).toBeNull();
  });

  it('returns error for short passwords', () => {
    expect(validatePassword('Short1!')).toBe('Password must be at least 8 characters');
  });

  it('returns error for missing uppercase', () => {
    expect(validatePassword('weakpass1!')).toContain('uppercase');
  });

  it('returns error for missing number', () => {
    expect(validatePassword('WeakPass!')).toContain('number');
  });

  it('returns error for missing special char', () => {
    expect(validatePassword('WeakPass1')).toContain('special character');
  });
});

describe('validateRequired', () => {
  it('returns null for valid input', () => {
    expect(validateRequired('hello', 'Name')).toBeNull();
  });

  it('returns error for empty input', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required');
  });

  it('returns error for too short input', () => {
    expect(validateRequired('a', 'Name', 2)).toBe('Name must be at least 2 characters');
  });
});

describe('validatePrice', () => {
  it('returns null for valid price', () => {
    expect(validatePrice('5000')).toBeNull();
  });

  it('returns error for zero price', () => {
    expect(validatePrice('0')).toBe('Please enter a valid price greater than 0');
  });

  it('returns error for non-numeric', () => {
    expect(validatePrice('abc')).toBe('Please enter a valid price greater than 0');
  });
});

describe('sanitizeSearchQuery', () => {
  it('truncates long queries', () => {
    const longQuery = 'a'.repeat(200);
    expect(sanitizeSearchQuery(longQuery).length).toBe(100);
  });

  it('strips HTML from queries', () => {
    expect(sanitizeSearchQuery('<script>alert(1)</script>lagos')).toBe('lagos');
  });
});
