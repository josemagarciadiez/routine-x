export function Input({
  placeholder = "",
  required = false,
  id = "",
  type = "text",
  name = "",
  disabled = false,
} = {}) {
  const input = document.createElement("input");

  // Atributes
  id && input.setAttribute("id", id);
  name && input.setAttribute("name", name);

  input.required = required;
  input.placeholder = placeholder;
  input.disabled = disabled;
  input.type = type;

  //Styles
  input.className = "input-primitive";

  /**
   * Metodo para obtener el valor actual del campo
   * desde un controlador externo.
   *
   * @returns
   */
  input.getValue = () => input.value;

  /**
   * Metodo para marcar que el campo tiene un error.
   */
  input.setError = () => {
    input.setAttribute("aria-invalid", "true");
  };

  /**
   * Metodo para limpiar el campo de errores.
   */
  input.clearError = () => {
    input.setAttribute("aria-invalid", "false");
  };

  return input;
}
