import { describe, it, expect } from 'vitest';
import { validateName, validateValue, validateToken } from '../src/data/tokenValidation.js';

const tokens = [{ id: 'a', name: 'color.brand.primary', value: '#315FCE', type: 'color' }];

describe('validateName', () => {
  it('rejects empty and whitespace-only names', () => {
    expect(validateName('', tokens)).toBeTruthy();
    expect(validateName('   ', tokens)).toBeTruthy();
  });
  it('rejects names with spaces or odd characters', () => {
    expect(validateName('my token', tokens)).toBeTruthy();
    expect(validateName('--bad', tokens)).toBeTruthy();
  });
  it('rejects duplicates ignoring case but allows the token itself', () => {
    expect(validateName('Color.Brand.Primary', tokens)).toBeTruthy();
    expect(validateName('color.brand.primary', tokens, 'a')).toBe('');
  });
  it('accepts a normal name', () => {
    expect(validateName('space.12', tokens)).toBe('');
  });
});

describe('validateValue', () => {
  it('rejects empty values', () => {
    expect(validateValue('  ', 'string')).toBeTruthy();
  });
  it('checks colours', () => {
    expect(validateValue('#315FCE', 'color')).toBe('');
    expect(validateValue('rgb(1, 2, 3)', 'color')).toBe('');
    expect(validateValue('blue-ish', 'color')).toBeTruthy();
    expect(validateValue('#12', 'color')).toBeTruthy();
  });
  it('checks dimensions and numbers', () => {
    expect(validateValue('16px', 'dimension')).toBe('');
    expect(validateValue('120ms', 'dimension')).toBe('');
    expect(validateValue('big', 'dimension')).toBeTruthy();
    expect(validateValue('1.5', 'number')).toBe('');
    expect(validateValue('abc', 'number')).toBeTruthy();
  });
  it('accepts any non-empty string or font', () => {
    expect(validateValue('0 4px 16px rgba(0,0,0,.08)', 'string')).toBe('');
    expect(validateValue('Inter, sans-serif', 'font')).toBe('');
  });
});

describe('validateToken', () => {
  it('returns errors keyed by field', () => {
    expect(validateToken({ name: '', value: '', type: 'color' }, tokens)).toEqual({
      name: expect.any(String),
      value: expect.any(String),
    });
    expect(validateToken({ name: 'color.new', value: '#fff', type: 'color' }, tokens)).toEqual({});
  });
});
