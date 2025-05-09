export function Label({ label = "", htmlFor = "" }) {
  const $label = document.createElement("label");
  $label.className = "label-primitive";
  $label.textContent = label;
  $label.setAttribute("for", htmlFor);
  return $label;
}
