/**
 * Crea un botón HTML con estilos y comportamientos personalizables.
 *
 * @param {Object} props - Propiedades del botón.
 * @param {string|Node} props.label - Texto o nodo que se mostrará como contenido del botón.
 * @param {Function} props.onClick - Función que se ejecutará al hacer clic en el botón.
 * @param {string} [props.variant="default"] - Variante visual del botón. Puede ser: "default", "destructive", "outline", "secondary", "ghost", "link".
 * @param {string} [props.size="default"] - Tamaño del botón. Puede ser: "default", "sm", "lg", "icon".
 *
 * @returns {HTMLButtonElement} - Botón generado.
 */
export function Button({
  label,
  onClick,
  variant = "default",
  size = "default",
}) {
  // Crea el contenedor
  const $button = document.createElement("button");
  // Aplica las clases correspondientes al estilo
  $button.className = buttonVariant({ variant, size });
  // Inserta el contenido (texto o nodo)
  if (typeof label === "string") {
    const $label = document.createTextNode(label);
    $button.appendChild($label);
  } else {
    $button.appendChild(label);
  }
  // Asigna el evento onClick
  onClick &&
    $button.addEventListener("click", (evento) => {
      evento.preventDefault();
      onClick();
    });
  // Devuelve el elemento HTML para ser agregado al DOM
  return $button;
}

/**
 * Devuelve la clase CSS compuesta según el tipo y tamaño del botón.
 *
 * @param {Object} config
 * @param {string} config.variant
 * @param {string} config.size
 * @returns {string}
 */
function buttonVariant({ variant = "destructive", size = "lg" }) {
  const base = "button-base";

  const variants = {
    default: "button-variant-default",
    destructive: "button-variant-destructive",
    outline: "button-variant-outline",
    secondary: "button-variant-secondary",
    ghost: "button-variant-ghost",
    link: "button-variant-link",
  };

  const sizes = {
    default: "button-size-default",
    sm: "button-size-sm",
    lg: "button-size-lg",
    icon: "button-size-icon",
  };

  return `${base} ${variants[variant]} ${sizes[size]}`;
}
