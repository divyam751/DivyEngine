/**
 * Converts a string to Title Case.
 * Example: "jOhN   dOE sMiTh" → "John Doe Smith"
 */
const toTitleCase = (str) => {
  if (!str) return str;
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default toTitleCase;
