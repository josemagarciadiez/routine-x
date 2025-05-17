export function createPortal(content) {
  const target = document.body;
  target.appendChild(content);
  content.close = function () {
    setTimeout(() => {
      target.removeChild(content);
    }, 200);
  };
  return content;
}
