const NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;
const COLOR_PATTERN = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|hsl|hwb|lab|lch|oklab|oklch|color)a?\(.+\))$/i;
const DIMENSION_PATTERN = /^-?(\d+\.?\d*|\.\d+)(px|rem|em|%|vh|vw|pt|ms|s)?$/i;

export function validateName(name, tokens, ignoreId) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return 'Enter a token name.';
  if (!NAME_PATTERN.test(trimmed)) return 'Use letters, numbers, dots, dashes or underscores, with no spaces.';
  const clash = tokens.some((t) => t.id !== ignoreId && t.name.trim().toLowerCase() === trimmed.toLowerCase());
  if (clash) return 'A token with this name already exists.';
  return '';
}

export function validateValue(value, type) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return 'Enter a token value.';
  if (type === 'color' && !COLOR_PATTERN.test(trimmed)) return 'Use a hex, rgb() or hsl() colour, for example #315FCE.';
  if (type === 'dimension' && !DIMENSION_PATTERN.test(trimmed)) return 'Use a number with an optional unit, for example 16px or 120ms.';
  if (type === 'number' && !Number.isFinite(Number(trimmed))) return 'Use a plain number.';
  return '';
}

export function validateToken(token, tokens, ignoreId) {
  const errors = {};
  const name = validateName(token.name, tokens, ignoreId);
  const value = validateValue(token.value, token.type);
  if (name) errors.name = name;
  if (value) errors.value = value;
  return errors;
}
