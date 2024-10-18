export const zodErrorObjectToStringConverter = (
  errorObject: Record<string, string[]>
): string => {
  return Object.entries(errorObject)
    .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
    .join("; ");
};
