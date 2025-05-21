// Importa una utilidad para generar contendor <img> con un icono svg de la carpeta assets.
import { ChevronRight } from "../../assets/icons/icons.mjs";
import { createIcon } from "../../lib/create-icon.mjs";
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
  // Attributes
  element.setAttribute("data-slot", "dropdown-menu-trigger"); // identificador semántico
  element.setAttribute("popovertarget", id); // conecta el trigger con el popover
  //   Anchor property
  element.style.setProperty("anchor-name", `--anchor-${id}`); // define el punto de anclaje para el posicionamiento

  return element;
}

// Configura el contenido del menú como un popover
function DropdownMenuPopover(element, id, align) {
  // Attributes
  element.setAttribute("data-slot", "dropdown-menu-popover");
  element.setAttribute("data-align", align); // permite aplicar estilos por dirección
  element.setAttribute("popover", "auto"); // popover controlado automáticamente
  element.setAttribute("id", id); // ID único para enlazar con el trigger
  //   Anchor property
  element.style.setProperty("position-anchor", `--anchor-${id}`); // posicionamiento anclado al trigger

  return element;
}

// Crea el contenedor de contenido del menú (los ítems)
export function DropdownMenuContent({ label, content }) {
  const container = document.createElement("div");
  //   Attributes
  container.setAttribute("data-slot", "dropdown-menu-content");
  container.setAttribute("role", "menu"); // semántica de accesibilidad
  //   Styles
  container.className = "dropdown-menu-content";

  //   Children
  label && container.appendChild(label);
  label && container.appendChild(DropdownMenuSeparator());
  content && container.append(...content);

  // Events
  container.querySelectorAll("button, a, [role=button]").forEach((element) => {
    element.addEventListener("click", () => {
      const popover = container.closest("[popover]");
      if (popover) {
        popover.hidePopover();
      }
    });
  });

  return container;
}

// Separador visual entre secciones del menú
export function DropdownMenuSeparator() {
  const separator = document.createElement("div");
  //   Attributes
  separator.setAttribute("data-slot", "dropdown-menu-separator");
  separator.setAttribute("role", "none"); // no impacta accesibilidad

  //   Styles
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
  //   Attributes
  container.setAttribute("data-slot", "dropdown-menu-item");
  container.setAttribute("role", "button"); // actúa como botón
  container.setAttribute("data-variant", `${variant}`); // permite cambiar estilos
  disabled && container.setAttribute("data-disabled", "true");
  //   Events
  action && container.addEventListener("click", action);
  // Styles
  container.className = "dropdown-menu-item";
  // Children
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
  // Attributes
  container.setAttribute("data-slot", "dropdown-menu-sub-trigger");
  container.setAttribute("popovertarget", id); // conecta con el popover
  container.style.setProperty("anchor-name", `--anchor-${id}`);
  // Styles
  container.className = `dropdown-menu-item ${className}`;

  let isHovering = false;
  let hoverTimeout;

  // Events
  // Cuando el mouse entra, se abre el submenú
  container.addEventListener("mouseenter", () => {
    isHovering = true;
    clearTimeout(hoverTimeout);

    const popover = document.getElementById(id);
    if (popover) {
      popover.showPopover();

      // Agregar evento al submenu para detectar cuando el mouse entra
      if (!popover.hasAttribute("data-has-listeners")) {
        popover.setAttribute("data-has-listeners", "true");

        popover.addEventListener("mouseenter", () => {
          isHovering = true;
          clearTimeout(hoverTimeout);
        });

        popover.addEventListener("mouseleave", (event) => {
          // Verificar que el mouse no vaya al trigger
          const relatedTarget = event.relatedTarget;

          if (
            relatedTarget &&
            (relatedTarget === container || container.contains(relatedTarget))
          ) {
            return;
          }

          isHovering = false;

          hoverTimeout = setTimeout(() => {
            if (!isHovering) {
              popover.hidePopover();
            }
          }, 150);
        });
      }
    }
  });

  // Cuando el mouse sale del trigger
  container.addEventListener("mouseleave", (event) => {
    // Verificar si estamos entrando al submenu
    const relatedTarget = event.relatedTarget;
    const popover = document.getElementById(id);

    if (
      relatedTarget &&
      popover &&
      (relatedTarget === popover || popover.contains(relatedTarget))
    ) {
      return; // El mouse se movio desde el trigger al submenu, se mantiene abierto
    }

    isHovering = false;

    hoverTimeout = setTimeout(() => {
      if (!isHovering && popover) {
        popover.hidePopover();
      }
    }, 150);
  });

  // Icon
  const icon = createIcon(ChevronRight);
  icon.classList.add("sub-trigger-icon");

  // Children
  container.appendChild(document.createTextNode(label));
  container.appendChild(icon);

  return container;
}

// Popover del submenú: manual (no auto)
function DropdownMenuSubPopover(element, id) {
  // Attributes
  element.setAttribute("data-slot", "dropdown-menu-sub-popover");
  element.setAttribute("popover", "manual");
  element.setAttribute("id", id);
  // Anchor property
  element.style.setProperty("position-anchor", `--anchor-${id}`);

  return element;
}

// Contenido del submenú
export function DropdownMenuSubContent({ label, content }) {
  const container = document.createElement("div");
  //   Attributes
  container.setAttribute("data-slot", "dropdown-menu-sub-content");
  container.setAttribute("role", "menu");
  //   Styles
  container.className = "dropdown-menu-sub-content";

  // Events

  //   Children
  label && container.appendChild(label);
  label && container.appendChild(DropdownMenuSeparator());
  content && container.append(...content);

  return container;
}

// Etiqueta / encabezado de una sección del menú
export function DropdownMenuLabel(label) {
  const container = document.createElement("h3");
  // Attributes
  container.setAttribute("data-slot", "dropdown-menu-label");
  // Styles
  container.className = "dropdown-menu-label";
  // Children
  container.textContent = label;

  return container;
}
