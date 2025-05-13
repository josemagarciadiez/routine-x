// Importa una utilidad para generar IDs únicos (por ejemplo: "dropdown-menu-1234")
import { createID } from "../../lib/create-id.mjs";

// Función principal que crea el menú desplegable uniendo trigger y contenido
export function DropdownMenu({
  trigger,
  content,
  options: { align = "bottom" } = {}, // por defecto se alinea abajo
}) {
  const menuId = createID("dropdown-menu"); // genera un ID único para el menú

  // Configura el trigger con los atributos necesarios
  const $trigger = DropdownMenuTrigger(trigger, menuId);
  // Configura el contenido como popover con alineación
  const $content = DropdownMenuPopover(content, menuId, align);

  // Crea un fragmento para agrupar ambos nodos
  const fragment = document.createDocumentFragment();
  fragment.appendChild($trigger);
  fragment.appendChild($content);

  return fragment; // devuelve el fragmento para insertar en el DOM
}

// Configura el trigger del menú
function DropdownMenuTrigger(element, id) {
  element.setAttribute("data-slot", "dropdown-menu-trigger"); // identificador semántico
  element.setAttribute("popovertarget", id); // conecta el trigger con el popover
  element.style.setProperty("anchor-name", `--anchor-${id}`); // define el punto de anclaje para el posicionamiento

  return element;
}

// Configura el contenido del menú como un popover
function DropdownMenuPopover(element, id, align) {
  element.setAttribute("data-slot", "dropdown-menu-popover");
  element.setAttribute("data-align", align); // permite aplicar estilos por dirección
  element.setAttribute("popover", "auto"); // popover controlado automáticamente
  element.setAttribute("id", id); // ID único para enlazar con el trigger
  element.style.setProperty("position-anchor", `--anchor-${id}`); // posicionamiento anclado al trigger

  return element;
}

// Crea el contenedor de contenido del menú (los ítems)
export function DropdownMenuContent({ label, content }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dropdown-menu-content");
  container.setAttribute("role", "menu"); // semántica de accesibilidad
  container.className = "dropdown-menu-content"; // clase para aplicar estilos

  // Si hay un label, se agrega al principio junto con un separador
  label && container.appendChild(label);
  label && container.appendChild(DropdownMenuSeparator());
  content && container.append(...content); // agrega los elementos del menú

  // Evento: cierra el popover al hacer clic en botones o enlaces
  container.querySelectorAll("button, a, [role=button]").forEach((element) => {
    element.addEventListener("click", () => {
      const popover = container.closest("[popover]");
      if (popover) popover.hidePopover();
    });
  });

  return container;
}

// Separador visual entre secciones del menú
export function DropdownMenuSeparator() {
  const separator = document.createElement("div");
  separator.setAttribute("data-slot", "dropdown-menu-separator");
  separator.setAttribute("role", "none"); // no impacta accesibilidad
  separator.className = "dropdown-menu-separator";

  return separator;
}

// Ítem interactivo del menú
export function DropdownMenuItem({
  label,
  icon,
  variant = "default",
  action,
  disabled = false,
}) {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "dropdown-menu-item");
  container.setAttribute("role", "button"); // actúa como botón
  container.setAttribute("data-variant", `${variant}`); // permite cambiar estilos
  disabled && container.setAttribute("data-disabled", "true");
  action && container.addEventListener("click", action); // evento click si está definido
  container.className = "dropdown-menu-item";

  // Agrega icono (si hay) y texto
  icon && container.appendChild(icon);
  label && container.appendChild(document.createTextNode(label));

  return container;
}

// Submenú: ítem con submenú anidado
export function DropdownMenuSub({ label, content }) {
  const subMenuId = createID("dropdown-menu-sub");

  // Crea el trigger del submenú y su contenido
  const $trigger = DropdownMenuSubTrigger(label, subMenuId);
  const $content = DropdownMenuSubPopover(content, subMenuId);

  const fragment = document.createDocumentFragment();
  fragment.appendChild($trigger);
  fragment.appendChild($content);

  return fragment;
}

// Trigger que abre el submenú al pasar el mouse
function DropdownMenuSubTrigger(label, id, className = "") {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "dropdown-menu-sub-trigger");
  container.setAttribute("popovertarget", id); // conecta con el popover
  container.style.setProperty("anchor-name", `--anchor-${id}`);
  container.className = `dropdown-menu-item ${className}`;

  let isHovering = false;
  let hoverTimeout;

  // Cuando el mouse entra, se abre el submenú
  container.addEventListener("mouseenter", () => {
    isHovering = true;
    clearTimeout(hoverTimeout);

    const popover = document.getElementById(id);
    if (popover) {
      popover.showPopover();

      // Si no se ha configurado ya, agrega listeners para mouseover al contenido
      if (!popover.hasAttribute("data-has-listeners")) {
        popover.setAttribute("data-has-listeners", "true");

        // Si el mouse entra al contenido del submenú, se mantiene abierto
        popover.addEventListener("mouseenter", () => {
          isHovering = true;
          clearTimeout(hoverTimeout);
        });

        // Si el mouse sale, se espera un poco antes de cerrar
        popover.addEventListener("mouseleave", (event) => {
          const relatedTarget = event.relatedTarget;
          if (
            relatedTarget &&
            (relatedTarget === container || container.contains(relatedTarget))
          ) {
            return; // se movió hacia el trigger, no cerrar
          }

          isHovering = false;
          hoverTimeout = setTimeout(() => {
            if (!isHovering) popover.hidePopover();
          }, 150);
        });
      }
    }
  });

  // Cuando el mouse sale del trigger
  container.addEventListener("mouseleave", (event) => {
    const relatedTarget = event.relatedTarget;
    const popover = document.getElementById(id);

    if (
      relatedTarget &&
      popover &&
      (relatedTarget === popover || popover.contains(relatedTarget))
    ) {
      return; // se está moviendo hacia el popover, mantenerlo abierto
    }

    isHovering = false;
    hoverTimeout = setTimeout(() => {
      if (!isHovering && popover) popover.hidePopover();
    }, 150);
  });

  container.appendChild(document.createTextNode(label)); // TODO: ícono de flecha

  return container;
}

// Popover del submenú: manual (no auto)
function DropdownMenuSubPopover(element, id) {
  element.setAttribute("data-slot", "dropdown-menu-sub-popover");
  element.setAttribute("popover", "manual");
  element.setAttribute("id", id);
  element.style.setProperty("position-anchor", `--anchor-${id}`);

  return element;
}

// Contenido del submenú
export function DropdownMenuSubContent({ label, content }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dropdown-menu-sub-content");
  container.setAttribute("role", "menu");
  container.className = "dropdown-menu-sub-content";

  label && container.appendChild(label);
  label && container.appendChild(DropdownMenuSeparator());
  content && container.append(...content);

  return container;
}

// Etiqueta / encabezado de una sección del menú
export function DropdownMenuLabel(label) {
  const container = document.createElement("h3");
  container.setAttribute("data-slot", "dropdown-menu-label");
  container.className = "dropdown-menu-label";
  container.textContent = label;

  return container;
}
