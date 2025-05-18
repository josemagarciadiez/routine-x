export function createIcon(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString(), "image/svg+xml");
  return doc.documentElement;
}
