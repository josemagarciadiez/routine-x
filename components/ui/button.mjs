export function Button({
  label,
  onClick,
  variant = "default",
  size = "default",
}) {
  const $button = document.createElement("button");

  $button.className = buttonVariant({ variant, size });

  if (typeof label === "string") {
    const $label = document.createTextNode(label);
    $button.appendChild($label);
  } else {
    $button.appendChild(label);
  }

  onClick &&
    $button.addEventListener("click", (evento) => {
      evento.preventDefault();
      onClick();
    });

  return $button;
}

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
