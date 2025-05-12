export function createIcon(href) {
  const icon = document.createElement("img");
  icon.setAttribute("src", href);
  return icon;
}
