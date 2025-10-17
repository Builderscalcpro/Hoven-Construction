import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, formatPhoneNumber, slugify } from '../utils';

describe('Utils', () => {
  describe('cn (classname utility)', () => {
    it('combines class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
      expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
    });

    it('merges tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-3')).toBe('py-1 px-3');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles undefined and null values', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
  });

  describe('formatDate', () => {
    it('formats date strings', () => {
      const date = '2024-01-15T10:30:00Z';
      expect(formatDate(date)).toContain('Jan');
      expect(formatDate(date)).toContain('15');
      expect(formatDate(date)).toContain('2024');
    });

    it('formats Date objects', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('Jan');
      expect(formatDate(date)).toContain('15');
      expect(formatDate(date)).toContain('2024');
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10-digit phone numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567');
    });

    it('handles numbers with country code', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
      expect(formatPhoneNumber('+15551234567')).toBe('+1 (555) 123-4567');
    });

    it('returns original for invalid formats', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('abc')).toBe('abc');
    });
  });

  describe('slugify', () => {
    it('converts text to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a TEST')).toBe('this-is-a-test');
    });

    it('handles special characters', () => {
      expect(slugify('Hello & World!')).toBe('hello-world');
      expect(slugify('Test@123#')).toBe('test-123');
    });

    it('handles multiple spaces and dashes', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Test---Case')).toBe('test-case');
    });

    it('handles empty strings', () => {
      expect(slugify('')).toBe('');
      expect(slugify('   ')).toBe('');
    });
  });
});