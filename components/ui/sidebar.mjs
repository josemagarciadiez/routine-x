/**
 * SISTEMA DE SIDEBAR/BARRA LATERAL
 *
 * Este archivo implementa un sistema completo de barra lateral (sidebar) con las siguientes características:
 * - Responsivo: Se adapta automáticamente a dispositivos móviles y desktop
 * - Configurable: Permite personalizar posición, variante y comportamiento
 * - Accesible: Incluye navegación por teclado y roles ARIA
 * - Modular: API completa para construir interfaces complejas
 */

import { createID } from "../../lib/create-id.mjs";
import { createIcon } from "../../lib/create-icon.mjs";
import { Button } from "../ui/button.mjs";

import { PanelLeft, PanelRight } from "../../assets/icons/icons.mjs";
import { createPortal } from "../../lib/create-portal.mjs";

/**
 *
 * Crea y gestiona una barra lateral completa con funcionalidades responsivas.
 * En desktop funciona como sidebar fijo, en móvil como modal overlay.
 *
 * @param {Object} params - Parámetros de configuración
 * @param {HTMLElement} params.header - Elemento DOM para la cabecera del sidebar
 * @param {HTMLElement} params.content - Elemento DOM para el contenido principal
 * @param {HTMLElement} params.footer - Elemento DOM para el pie del sidebar
 * @param {Object} params.options - Opciones de configuración
 * @param {string} params.options.side - Posición del sidebar ('left' | 'right')
 * @param {string} params.options.variant - Variante visual del sidebar
 * @param {string} params.options.collapsible - Tipo de comportamiento colapsable
 *
 * @returns {Object} - Objeto con métodos Inset y trigger para integrar con la aplicación
 *
 */
export function Sidebar({
  header,
  content,
  footer,
  options: {
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
  } = {},
}) {
  /** Variables de estado */

  /**
   * Controla si el sidebar está abierto o cerrado
   * @type {boolean}
   */
  let isOpen = true;

  /**
   * Detecta si estamos en un dispositivo móvil (< 768px)
   * @type {boolean}
   */
  let isMobile = checkIfMobile();

  /**
   * Referencia al portal DOM usado en vista móvil
   * Se crea dinámicamente cuando se abre el sidebar en móvil
   * @type {HTMLElement|null}
   */
  let portal = null;

  /** Estructura DOM */

  /**
   * ID único para la instancia, usado para eventos personalizados
   * y referencias específicas
   */
  const id = createID("sidebar");

  /**
   * Construcción jerárquica de la estructura DOM:
   * wrapper > container > sidebar > (header, content, footer)
   */

  // Contenedor interno con header, content y footer
  const sidebar = SidebarInner({ header, content, footer });
  // Envuelve el contenido interno del sidebar, y
  // es el contenedor que se abre/cierra segun la necesidad.
  const container = SidebarContainer(sidebar);
  // Contenedor principal del sidebar, es quien guarda el
  // estado y configuracion en su dataset (data-*)
  const wrapper = SidebarWrapper(container);

  // Configuracion inicial del dataset del contenedor principal.
  wrapper.config({ open: isOpen, side, variant, collapsible });

  /** Lógica móvil: Crear el portal cuando la pantalla es mobile desde el inicio. */
  if (isMobile && isOpen) {
    // Creamos el contenido específico para el portal móvil
    // Este contenido "roba" los elementos header, content, footer del sidebar original
    const portalContent = SidebarPortalContent({
      header,
      content,
      footer,
      options: { side },
    });

    // Creamos el portal completo (overlay + contenido)
    portal = SidebarPortal(portalContent, id);
    // Activamos visualmente el portal
    if (portal) {
      portal.setState("open");
    }
  }

  /** Funciones internas para encapsulacion del comportamiento */

  /**
   * Restaura el contenido original al sidebar después de que fue movido al portal móvil.
   *
   * En vista móvil, los elementos header, content y footer son "robados" por el portal
   * para renderizarlos en el sheet. Esta función los devuelve al sidebar original
   * cuando se cierra el sheet o se cambia a vista desktop.
   */
  function updateSidebar() {
    // Verificamos que los elementos existan antes de moverlos
    // El operador && evita errores si algún elemento es null/undefined
    header && sidebar.appendChild(header);
    content && sidebar.appendChild(content);
    footer && sidebar.appendChild(footer);
  }

  /**
   * Detecta si estamos en un dispositivo móvil basándose en el ancho de ventana.
   *
   * @returns {boolean} true si el ancho es menor a 768px (breakpoint móvil)
   */
  function checkIfMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Maneja los cambios de tamaño de ventana para adaptarse entre móvil y desktop.
   *
   * Cuando el usuario cambia el tamaño de la ventana (ej: rotar dispositivo,
   * redimensionar navegador), esta función se ejecuta para:
   *
   * 1. Detectar si cambió el estado móvil/desktop
   * 2. Cerrar automáticamente el sidebar si está abierto y cambió a móvil
   *
   * Esto evita problemas de UX donde el sidebar queda en estado inconsistente.
   */
  function handleResize() {
    // Guardamos el estado anterior
    const wasMobile = isMobile;
    // Calculamos el nuevo estado
    isMobile = checkIfMobile();
    // Si cambió de desktop a móvil (o viceversa) Y el sidebar está abierto
    if (wasMobile !== isMobile && isOpen) {
      // Cerramos para evitar estados inconsistentes
      close();
    }
  }

  /**
   * Abre el sidebar con comportamiento diferente según el dispositivo.
   *
   * DESKTOP: Actualiza las clases CSS del wrapper para mostrar la animación
   * MÓVIL: Crea un portal (modal) que se renderiza en un contenedor separado
   *
   */
  function open() {
    isOpen = true;

    /** Lógica móvil: Crear el portal */
    if (isMobile) {
      // Creamos el contenido específico para el portal móvil
      // Este contenido "roba" los elementos header, content, footer del sidebar original
      const portalContent = SidebarPortalContent({
        header,
        content,
        footer,
        options: { side },
      });

      // Creamos el portal completo (overlay + contenido)
      portal = SidebarPortal(portalContent, id);
      // Activamos visualmente el portal
      if (portal) {
        portal.setState("open");
      }
    } else {
      /** Lógica desktop: Actualizar el wrapper */

      // En desktop, simplemente cambiamos el estado del wrapper
      // Las animaciones CSS se encargan del resto
      wrapper.toggle(true);
    }
  }

  /**
   * Cierra el sidebar con limpieza apropiada según el dispositivo.
   *
   * DESKTOP: Actualiza las clases CSS del wrapper
   * MÓVIL: Destruye el portal y restaura el contenido original
   *
   */
  function close() {
    isOpen = false;

    // Verificamos si estamos en móvil O si existe un portal activo
    // (el portal puede existir si se cambió de móvil a desktop sin cerrar)
    if (isMobile || portal) {
      /** Lógica móvil: Destruir el portal */

      // Animación de cierre
      portal.setState("closed");
      // Destruir el portal del DOM
      portal.close();
      // Limpiar referencia
      portal = null;
      // Restaurar contenido al sidebar original
      updateSidebar();
    } else {
      /** Lógica desktop: Actualizar el wrapper */

      // En desktop, simplemente cambiamos el estado del wrapper
      // Las animaciones CSS se encargan del resto
      wrapper.toggle(false);
    }
  }

  /**
   * Alterna entre abrir y cerrar el sidebar.
   * Función simple que delega la lógica a open() y close()
   *
   */
  const toggle = () => {
    isOpen ? close() : open();
  };

  /**
   * Maneja los atajos de teclado para controlar el sidebar.
   *
   * TECLA "b": Alterna el sidebar (solo si es colapsable o estamos en móvil)
   * TECLA "Escape": Cierra el sidebar en móvil (patrón estándar de modales)
   *
   * @param {KeyboardEvent} event - Evento de teclado
   *
   */
  function handleKeyDown(event) {
    // Atajo "b" para alternar sidebar
    if (event.key === "b") {
      // Solo permitimos el toggle si el sidebar es colapsable o estamos en móvil
      if (collapsible !== "none" || isMobile) {
        toggle();
      }
    }

    // Atajo "Escape" para cerrar en móvil (patrón UX estándar)
    if (event.key === "Escape") {
      if (isMobile && isOpen) {
        close();
      }
    }
  }

  /** Registro de event listeners */

  /**
   * Event listener personalizado para cerrar el sidebar.
   * Usado principalmente por el overlay en vista móvil.
   */
  document.addEventListener(`sidebar-close-${id}`, toggle);

  /**
   * Event listener global para atajos de teclado.
   */
  document.addEventListener("keydown", handleKeyDown);

  /**
   * Event listener para cambios de tamaño de ventana.
   * Permite adaptación automática entre móvil y desktop.
   */
  window.addEventListener("resize", handleResize);

  /** Retorno de la API */

  return {
    /**
     * Método para crear un layout completo con sidebar + contenido principal.
     *
     * @param {HTMLElement} element - Contenido principal de la aplicación
     * @returns {HTMLElement} - Contenedor completo listo para agregar al DOM
     *
     */
    Inset: (element) => SidebarProvider(wrapper, SidebarInset(element)),

    /**
     * Botón trigger para abrir/cerrar el sidebar.
     * Se puede colocar en cualquier parte de la interfaz.
     */
    trigger: SidebarTrigger(side, toggle),
  };
}

// ============================================================================
// FUNCIONES INTERNAS PARA CREACIÓN DE ELEMENTOS DOM
// ============================================================================

/**
 * Crea el contenedor wrapper principal del sidebar.
 *
 * Este es el elemento de nivel más alto que contiene toda la funcionalidad
 * del sidebar. Incluye métodos para configurar y controlar su estado.
 *
 * @param {HTMLElement} element - Elemento hijo a envolver
 * @returns {HTMLElement} - Contenedor wrapper con métodos adicionales
 */
function SidebarWrapper(element) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar");
  container.className = "sidebar-wrapper";
  container.appendChild(element);

  /**
   * Configura los atributos data-* que controlan el comportamiento CSS.
   *
   * @param {Object} config - Configuración del wrapper
   * @param {boolean} config.open - Si el sidebar está abierto
   * @param {string} config.side - Lado del sidebar ('left' | 'right')
   * @param {string} config.variant - Variante visual
   * @param {string} config.collapsible - Tipo de comportamiento colapsable
   */
  container.config = function ({ open, side, variant, collapsible }) {
    container.setAttribute("data-state", open ? "expanded" : "collapsed");
    container.setAttribute("data-side", side);
    container.setAttribute("data-variant", variant);
    container.setAttribute("data-collapsible", collapsible);
  };

  /**
   * Alterna rápidamente entre estado abierto/cerrado.
   * Usado principalmente para la lógica desktop.
   *
   * @param {boolean} open - Nuevo estado del sidebar
   */
  container.toggle = function (open) {
    container.setAttribute("data-state", open ? "expanded" : "collapsed");
  };

  return container;
}

/**
 * Crea un contenedor intermedio para el sidebar.
 *
 * Este contenedor proporciona una capa adicional de styling y estructura.
 * Útil para separar las responsabilidades entre el wrapper (comportamiento)
 * y el container (presentación).
 *
 * @param {HTMLElement} element - Elemento hijo a contener
 * @returns {HTMLElement} - Contenedor intermedio
 */
function SidebarContainer(element) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-container");
  container.className = "sidebar-container";
  container.appendChild(element);
  return container;
}

/**
 * Crea el contenedor interno del sidebar que organiza header, content y footer.
 *
 * Este es el contenedor que realmente contiene el contenido visible del sidebar.
 * Organiza las tres secciones principales en orden vertical.
 *
 * @param {Object} params - Elementos del sidebar
 * @param {HTMLElement} params.header - Cabecera del sidebar
 * @param {HTMLElement} params.content - Contenido principal
 * @param {HTMLElement} params.footer - Pie del sidebar
 * @returns {HTMLElement} - Contenedor interno
 */
function SidebarInner({ header, content, footer }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-inner");
  container.className = "sidebar-inner";
  // Agregamos solo los elementos que existen (evitamos null/undefined)
  header && container.appendChild(header);
  content && container.appendChild(content);
  footer && container.appendChild(footer);
  return container;
}

/**
 * Crea el contenedor provider que combina sidebar con el área de contenido principal.
 *
 * Este es el contenedor de nivel más alto que incluye tanto el sidebar
 * como el área principal de la aplicación (inset). Proporciona el layout
 * completo de la interfaz.
 *
 * @param {HTMLElement} sidebar - El sidebar completo
 * @param {HTMLElement} inset - El área de contenido principal
 * @returns {HTMLElement} - Contenedor provider completo
 */
function SidebarProvider(sidebar, inset) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-wrapper");
  container.className = "sidebar-provider";
  container.appendChild(sidebar);
  container.appendChild(inset);
  return container;
}

/**
 * Crea el área de contenido principal de la aplicación.
 *
 * Este es el elemento <main> donde se renderiza el contenido principal
 * de la aplicación, junto al sidebar. Tiene semántica HTML apropiada.
 *
 * @param {HTMLElement} element - Contenido de la aplicación
 * @returns {HTMLElement} - Elemento main con el contenido
 */
function SidebarInset(element) {
  const container = document.createElement("main");
  container.setAttribute("data-slot", "sidebar-inset");
  container.className = "sidebar-inset";
  element && container.appendChild(element);
  return container;
}

/**
 * Crea el botón trigger que abre/cierra el sidebar.
 *
 * Este botón puede colocarse en cualquier parte de la interfaz (típicamente
 * en un header o toolbar). Incluye el icono apropiado según el lado del sidebar.
 *
 * @param {string} side - Lado del sidebar ('left' | 'right')
 * @param {Function} toggle - Función para alternar el sidebar
 * @returns {HTMLElement} - Botón trigger configurado
 */
function SidebarTrigger(side, toogle) {
  // Seleccionamos el icono apropiado según el lado del sidebar
  const iconString = side === "left" ? PanelLeft : PanelRight;
  // Creamos el icono usando una función helper.
  const icon = createIcon(iconString);
  // Creamos el botón.
  const trigger = Button({
    label: icon,
    variant: "ghost",
    size: "icon",
    onClick: () => {
      toogle();
    },
  });
  // Agregamos atributos específicos del sidebar
  trigger.setAttribute("data-slot", "sidebar-trigger");
  trigger.classList.add("sidebar-trigger-button");

  return trigger;
}

// ============================================================================
// SISTEMA DE PORTAL PARA VISTA MÓVIL
// ============================================================================

/**
 * Crea un portal modal para renderizar el sidebar en vista móvil.
 *
 * El portal es un patrón que permite renderizar contenido en una parte
 * diferente del DOM tree, típicamente para modales o overlays.
 *
 * @param {HTMLElement} element - Contenido del portal
 * @param {string} id - ID único del sidebar para eventos
 * @returns {HTMLElement} - Portal completo con overlay y contenido
 */
function SidebarPortal(element, id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-portal");
  // Creamos el overlay de fondo
  const overlay = SidebarOverlay(id);
  container.appendChild(overlay);
  container.appendChild(element);

  /**
   * Método para cambiar el estado visual del portal.
   * Controla tanto el overlay como el contenido del portal.
   *
   * @param {string} state - Estado del portal ('open' | 'closed')
   */
  container.setState = function (state) {
    overlay.setAttribute("data-state", state);
    element.setAttribute("data-state", state);
  };

  // Usamos una función helper para crear el portal real.
  return createPortal(container);
}

/**
 * Crea el overlay de fondo para el portal móvil.
 *
 * El overlay es el fondo semi-transparente que aparece detrás del sidebar
 * en vista móvil. Al hacer clic en él, se cierra el sidebar.
 *
 * @param {string} id - ID único del sidebar para eventos
 * @returns {HTMLElement} - Elemento overlay configurado
 */
function SidebarOverlay(id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-overlay");
  // Event listener para cerrar el sidebar al hacer clic en el overlay
  container.addEventListener("click", () => {
    // Disparamos un evento personalizado que el sidebar principal escucha
    document.dispatchEvent(new CustomEvent(`sidebar-close-${id}`));
  });

  container.className = "sheet-overlay";
  return container;
}

/**
 * Crea el contenido específico para el portal móvil.
 *
 * Este contenido tiene un layout optimizado para móvil, diferente al
 * sidebar desktop. Reorganiza header, content y footer para la vista modal.
 *
 * @param {Object} params - Elementos del sidebar
 * @param {HTMLElement} params.header - Cabecera del sidebar
 * @param {HTMLElement} params.content - Contenido principal
 * @param {HTMLElement} params.footer - Pie del sidebar
 * @param {Object} params.options - Opciones de configuración
 * @param {string} params.options.side - Lado del sidebar
 * @returns {HTMLElement} - Contenido del portal configurado
 */
function SidebarPortalContent({
  header,
  footer,
  content,
  options: { side = "left" },
}) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-portal-content");
  container.setAttribute("data-side", side);
  container.className = "sidebar-portal-content";

  // Agregamos el header si existe
  header && container.appendChild(header);
  // El contenido principal va envuelto en un contenedor adicional
  // para un mejor control del scroll y layout en móvil
  if (content) {
    const wrapper = document.createElement("div");
    wrapper.className = "sidebar-portal-content-inner-wrapper";
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  }
  // Agregamos el footer si existe
  footer && container.appendChild(footer);

  return container;
}

// ============================================================================
// API PÚBLICA - FUNCIONES (Componentes)  PARA CONSTRUIR SIDEBARS
// ============================================================================

/**
 * Crea un contenedor para la cabecera del sidebar.
 *
 * @param {...HTMLElement} elements - Elementos a incluir en la cabecera
 * @returns {HTMLElement} - Contenedor de cabecera
 */
export function SidebarHeader(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-header");
  container.setAttribute("data-sidebar", "header");
  container.className = "sidebar-header";
  container.append(...elements);
  return container;
}

/**
 * Crea un contenedor para el pie del sidebar.
 *
 * @param {...HTMLElement} elements - Elementos a incluir en el pie
 * @returns {HTMLElement} - Contenedor de pie
 */
export function SidebarFooter(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-footer");
  container.setAttribute("data-sidebar", "footer");
  container.className = "sidebar-footer";
  container.append(...elements);
  return container;
}

/**
 * Crea un separador visual para organizar contenido del sidebar.
 *
 * @param {string} orientation - Orientación del separador ('horizontal' | 'vertical')
 * @returns {HTMLElement} - Elemento separador
 */
export function SidebarSeparator(orientation = "horizontal") {
  const separator = document.createElement("div");
  separator.setAttribute("data-slot", "sidebar-separator");
  separator.setAttribute("data-sidebar", "separator");
  separator.setAttribute("role", "none");
  separator.setAttribute("data-orientation", orientation);
  separator.className = "sidebar-separator";
  return separator;
}

/**
 * Crea un contenedor para el contenido principal del sidebar.
 *
 * @param {...HTMLElement} elements - Elementos de contenido
 * @returns {HTMLElement} - Contenedor de contenido
 */
export function SidebarContent(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-content");
  container.setAttribute("data-sidebar", "content");
  container.className = "sidebar-content";
  container.append(...elements);
  return container;
}

/**
 * Crea un grupo de elementos relacionados dentro del sidebar.
 * Útil para organizar secciones de navegación.
 *
 * @param {...HTMLElement} elements - Elementos del grupo
 * @returns {HTMLElement} - Contenedor de grupo
 */
export function SidebarGroup(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group");
  container.setAttribute("data-sidebar", "group");
  container.className = "sidebar-group";
  container.append(...elements);
  return container;
}

/**
 * Crea una etiqueta para un grupo de elementos.
 *
 * @param {string} text - Texto de la etiqueta
 * @returns {HTMLElement} - Elemento de etiqueta
 */
export function SidebarGroupLabel(text) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group-label");
  container.setAttribute("data-sidebar", "group-label");
  container.className = "sidebar-group-label";
  container.appendChild(document.createTextNode(text));
  return container;
}

/**
 * Crea un botón de acción para un grupo de elementos.
 * Típicamente usado para acciones como "Agregar nuevo" o "Configurar".
 *
 * @param {HTMLElement} icon - Icono del botón
 * @returns {HTMLElement} - Botón de acción
 */
export function SidebarGroupAction(icon) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-group-action");
  container.setAttribute("data-sidebar", "group-action");
  container.className = "sidebar-group-action";
  container.appendChild(icon);
  return container;
}

/**
 * Crea un contenedor para el contenido de un grupo.
 *
 * @param {...HTMLElement} elements - Elementos del contenido del grupo
 * @returns {HTMLElement} - Contenedor de contenido de grupo
 */
export function SidebarGroupContent(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group-content");
  container.setAttribute("data-sidebar", "group-content");
  container.className = "sidebar-group-content";
  container.append(...elements);
  return container;
}

// ============================================================================
// SISTEMA DE MENÚS DE NAVEGACIÓN
// ============================================================================

/**
 * Crea una lista de menú de navegación.
 * Utiliza elementos de lista semánticamente correctos (<ul>).
 *
 * @param {...HTMLElement} elements - Elementos del menú (SidebarMenuItem)
 * @returns {HTMLElement} - Lista de menú
 */
export function SidebarMenu(...elements) {
  const container = document.createElement("ul");
  container.setAttribute("data-slot", "sidebar-menu");
  container.setAttribute("data-sidebar", "menu");
  container.className = "sidebar-menu";
  container.append(...elements);
  return container;
}

/**
 * Crea un elemento individual de menú.
 * Utiliza elemento de lista semánticamente correcto (<li>).
 *
 * @param {...HTMLElement} elements - Contenido del elemento de menú
 * @returns {HTMLElement} - Elemento de menú
 */
export function SidebarMenuItem(...elements) {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "sidebar-menu-item");
  container.setAttribute("data-sidebar", "menu-item");
  container.className = "sidebar-menu-item";
  container.append(...elements);
  return container;
}

/**
 * Crea un botón de menú principal con icono y texto.
 *
 * @param {Object} params - Configuración del botón
 * @param {string} params.label - Texto del botón
 * @param {HTMLElement} params.icon - Icono del botón
 * @param {boolean} params.active - Si el botón está activo
 * @param {Object} params.options - Opciones de estilo
 * @param {string} params.options.size - Tamaño del botón
 * @param {string} params.options.variant - Variante visual
 * @returns {HTMLElement} - Botón de menú
 */
export function SidebarMenuButton({
  label,
  icon,
  active = false,
  onClick,
  options: { size = "default", variant = "default" } = {},
}) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-menu-button");
  container.setAttribute("data-sidebar", "menu-button");
  container.setAttribute("data-size", size);
  container.setAttribute("data-variant", variant);
  container.setAttribute("data-active", String(active));
  container.className = "sidebar-menu-button";
  // Agregamos el icono si existe
  icon && container.appendChild(icon);
  // Creamos y agregamos el texto
  const text = document.createElement("span");
  text.textContent = label;
  container.appendChild(text);
  // Agregamos evento si existe el callback onClick
  onClick && container.addEventListener("click", onClick);
  return container;
}

/**
 * Crea un botón de acción secundaria para elementos de menú.
 * Típicamente usado para acciones como "Editar", "Eliminar", etc.
 *
 * @param {Object} params - Configuración del botón
 * @param {HTMLElement} params.icon - Icono del botón
 * @param {boolean} params.showOnHover - Si se muestra solo al hacer hover
 * @returns {HTMLElement} - Botón de acción
 */
export function SidebarMenuAction({ icon, showOnHover = false, action }) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-menu-action");
  container.setAttribute("data-sidebar", "menu-action");
  container.setAttribute("data-hover", String(showOnHover));
  container.className = "sidebar-menu-action";
  container.appendChild(icon);
  action && container.addEventListener("click", action);
  return container;
}

/**
 * Crea un badge/indicador para elementos de menú.
 * Útil para mostrar contadores, estados o notificaciones.
 *
 * @param {HTMLElement} icon - Contenido del badge (puede ser texto o icono)
 * @returns {HTMLElement} - Elemento badge
 */
export function SidebarMenuBadge(icon) {
  const container = document.createElement("span");
  container.setAttribute("data-slot", "sidebar-menu-badge");
  container.setAttribute("data-sidebar", "menu-badge");
  container.className = "sidebar-menu-badge";
  container.appendChild(icon);
  return container;
}

// ============================================================================
// SISTEMA DE SUBMENÚS
// ============================================================================

/**
 * Crea una lista de submenú anidado.
 * Utiliza elementos de lista semánticamente correctos (<ul>).
 *
 * @param {...HTMLElement} elements - Elementos del submenú
 * @returns {HTMLElement} - Lista de submenú
 */
export function SidebarMenuSub(...elements) {
  const container = document.createElement("ul");
  container.setAttribute("data-slot", "sidebar-menu-sub");
  container.setAttribute("data-sidebar", "menu-sub");
  container.className = "sidebar-menu-sub";
  container.append(...elements);
  return container;
}

/**
 * Crea un elemento individual de submenú.
 * Utiliza elemento de lista semánticamente correcto (<li>).
 *
 * @param {...HTMLElement} elements - Contenido del elemento de submenú
 * @returns {HTMLElement} - Elemento de submenú
 */
export function SidebarMenuSubItem(...elements) {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "sidebar-menu-sub-item");
  container.setAttribute("data-sidebar", "menu-sub-item");
  container.className = "sidebar-menu-sub-item";
  container.append(...elements);
  return container;
}

/**
 * Crea un botón/enlace de submenú con icono y texto.
 * Utiliza elemento <a> para mejor semántica de navegación.
 *
 * @param {Object} params - Configuración del botón
 * @param {string} params.label - Texto del botón
 * @param {HTMLElement} params.icon - Icono del botón
 * @param {boolean} params.isActive - Si el botón está activo
 * @param {Object} params.options - Opciones de estilo
 * @param {string} params.options.size - Tamaño del botón
 * @returns {HTMLElement} - Botón de submenú
 */
export function SidebarMenuSubButton({
  label,
  icon,
  isActive = false,
  onClick,
  options: { size = "md" } = {},
}) {
  const container = document.createElement("a");
  container.setAttribute("data-slot", "sidebar-menu-sub-button");
  container.setAttribute("data-sidebar", "menu-sub-button");
  container.setAttribute("data-active", String(isActive));
  container.setAttribute("data-size", size);
  container.className = "sidebar-menu-sub-button";

  icon && container.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = label;
  container.appendChild(text);

  onClick && container.addEventListener("click", onClick);

  return container;
}
