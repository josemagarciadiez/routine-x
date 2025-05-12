export function createPortal(content) {
  const target = document.body;
  target.appendChild(content);
  return content;
}
