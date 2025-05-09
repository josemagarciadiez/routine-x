export function Input({
  placeholder = "",
  required = false,
  id = "",
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

  // Errores
  errors && errors.length && input.setAttribute("aria-invalid", "true");
  
  //Styles
  input.className = "input-primitive";

  return input;
}
