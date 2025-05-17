export function createID(prefix) {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}
