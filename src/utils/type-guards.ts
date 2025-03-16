
/**
 * Type guard to check if a value is a non-null object
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * Safely extracts a string property from an object with a default fallback
 */
export const getStringProperty = (obj: unknown, property: string, defaultValue: string = ""): string => {
  if (isObject(obj) && property in obj && obj[property] != null) {
    return String(obj[property]);
  }
  return defaultValue;
};

/**
 * Safely extracts an array property from an object with a default fallback
 */
export const getArrayProperty = <T>(obj: unknown, property: string, defaultValue: T[] = []): T[] => {
  if (isObject(obj) && property in obj && Array.isArray(obj[property])) {
    return obj[property] as T[];
  }
  return defaultValue;
};

/**
 * Ensures a value is an array, converting it if needed
 */
export const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return [];
  }
  return [value];
};
