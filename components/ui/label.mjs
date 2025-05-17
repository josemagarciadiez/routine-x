export function Label({ text = "", htmlFor = "" }) {
  // Crea un nuevo elemento <label> en el DOM.
  const container = document.createElement("label");
  // Setea un atributo para mejor accesibilidad.
  container.setAttribute("data-slot", "label");
  // Agrega la clase base 'label-primitive' al <label>.
  container.className = "label-primitive";
  // Agrega texto al contenido del <label>
  container.textContent = text;
  // Setea un atributo para agrupar con un elemento.
  container.setAttribute("for", htmlFor);
  return container;
}
