export function Input({
  placeholder = "",
  required = false,
  id = "",
  type = "text",
  name = "",
  disabled = false,
  errors = [],
} = {}) {
  const input = document.createElement("input");

  // Atributes
  id && input.setAttribute("id", id);
  name && input.setAttribute("name", name);
  input.required = required;
  input.placeholder = placeholder;
  input.disabled = disabled;
  input.type = type;

  // Errores
  errors && errors.length && input.setAttribute("aria-invalid", "true");

  //Styles
  input.className = "input-primitive";

  return input;
}
