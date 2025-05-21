import { createID } from "../../lib/create-id.mjs";
import { createIcon } from "../../lib/create-icon.mjs";
import { Button } from "../ui/button.mjs";

import { PanelLeft, PanelRight } from "../../assets/icons/icons.mjs";
import { createPortal } from "../../lib/create-portal.mjs";

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
  let isOpen = false;
  let isMobile = checkIfMobile();
  let portal = null;

  const id = createID("sidebar");

  const sidebar = SidebarInner({ header, content, footer });
  const container = SidebarContainer(sidebar);
  const wrapper = SidebarWrapper(container);

  wrapper.config({ open: isOpen, side, variant, collapsible });

  function updateSidebar() {
    // Si es desktop, volvemos a agregar
    //  el contenido a sidebar (fue robado por el portal)
    header && sidebar.appendChild(header);
    content && sidebar.appendChild(content);
    footer && sidebar.appendChild(footer);
  }

  function checkIfMobile() {
    return window.innerWidth < 768;
  }

  function handleResize() {
    const wasMobile = isMobile;

    isMobile = checkIfMobile();

    if (wasMobile !== isMobile && isOpen) {
      close();
    }
  }

  function open() {
    isOpen = true;

    if (isMobile) {
      const portalContent = SidebarPortalContent({
        header,
        content,
        footer,
        options: { side },
      });

      portal = SidebarPortal(portalContent, id);

      if (portal) {
        portal.setState("open");
      }
    } else {
      // Si es desktop, actualizamos el wrapper
      wrapper.toggle(true);
    }
  }

  function close() {
    isOpen = false;

    if (isMobile || portal) {
      portal.setState("closed");
      portal.close();
      portal = null;
      updateSidebar();
    } else {
      // Si es desktop, actualizamos el wrapper
      wrapper.toggle(false);
    }
  }

  const toggle = () => {
    isOpen ? close() : open();
  };

  function handleKeyDown(event) {
    if (event.key === "b") {
      if (collapsible !== "none" || isMobile) {
        toggle();
      }
    }

    if (event.key === "Escape") {
      if (isMobile && isOpen) {
        close();
      }
    }
    // if (collapsible !== "none" && event.key === "b") {
    //   toggle();
    // } else if (event.key === "Escape") {
    //   if (isMobile && isOpen) {
    //     close();
    //   }
    // }
  }

  document.addEventListener(`sidebar-close-${id}`, toggle);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleResize);

  return {
    Inset: (element) => SidebarProvider(wrapper, SidebarInset(element)),
    trigger: SidebarTrigger(side, toggle),
  };
}

function SidebarWrapper(element) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar");
  container.className = "sidebar-wrapper";
  container.config = function ({ open, side, variant, collapsible }) {
    container.setAttribute("data-state", open ? "expanded" : "collapsed");
    container.setAttribute("data-side", side);
    container.setAttribute("data-variant", variant);
    container.setAttribute("data-collapsible", collapsible);
  };
  container.toggle = function (open) {
    container.setAttribute("data-state", open ? "expanded" : "collapsed");
  };
  container.appendChild(element);
  return container;
}

function SidebarContainer(element) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-container");
  container.className = "sidebar-container";
  container.appendChild(element);
  return container;
}

function SidebarInner({ header, content, footer }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-inner");
  container.className = "sidebar-inner";
  header && container.appendChild(header);
  content && container.appendChild(content);
  footer && container.appendChild(footer);
  return container;
}

function SidebarProvider(sidebar, inset) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-wrapper");
  container.className = "sidebar-provider";
  container.appendChild(sidebar);
  container.appendChild(inset);
  return container;
}

function SidebarInset(element) {
  const container = document.createElement("main");
  container.setAttribute("data-slot", "sidebar-inset");
  container.className = "sidebar-inset";
  element && container.appendChild(element);
  return container;
}

function SidebarTrigger(side, toogle) {
  const iconString = side === "left" ? PanelLeft : PanelRight;

  const icon = createIcon(iconString);

  const trigger = Button({
    label: icon,
    variant: "ghost",
    size: "icon",
    onClick: () => {
      toogle();
    },
  });

  trigger.setAttribute("data-slot", "sidebar-trigger");
  trigger.classList.add("sidebar-trigger-button");

  return trigger;
}

function SidebarPortal(element, id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-portal");
  const overlay = SidebarOverlay(id);
  container.appendChild(overlay);
  container.appendChild(element);
  container.setState = function (state) {
    overlay.setAttribute("data-state", state);
    element.setAttribute("data-state", state);
  };
  return createPortal(container);
}

function SidebarOverlay(id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-overlay");
  container.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent(`sidebar-close-${id}`));
  });
  container.className = "sheet-overlay";
  return container;
}

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
  // Childrens
  header && container.appendChild(header);

  if (content) {
    const wrapper = document.createElement("div");
    wrapper.className = "sidebar-portal-content-inner-wrapper";
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  }

  footer && container.appendChild(footer);

  return container;
}

// API
export function SidebarHeader(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-header");
  container.setAttribute("data-sidebar", "header");
  container.className = "sidebar-header";
  container.append(...elements);
  return container;
}

export function SidebarFooter(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-footer");
  container.setAttribute("data-sidebar", "footer");
  container.className = "sidebar-footer";
  container.append(...elements);
  return container;
}

export function SidebarSeparator(orientation = "horizontal") {
  const separator = document.createElement("div");
  separator.setAttribute("data-slot", "sidebar-separator");
  separator.setAttribute("data-sidebar", "separator");
  separator.setAttribute("role", "none");
  separator.setAttribute("data-orientation", orientation);
  separator.className = "sidebar-separator";
  return separator;
}

export function SidebarContent(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-content");
  container.setAttribute("data-sidebar", "content");
  container.className = "sidebar-content";
  container.append(...elements);
  return container;
}

export function SidebarGroup(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group");
  container.setAttribute("data-sidebar", "group");
  container.className = "sidebar-group";
  container.append(...elements);
  return container;
}

export function SidebarGroupLabel(text) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group-label");
  container.setAttribute("data-sidebar", "group-label");
  container.className = "sidebar-group-label";
  container.appendChild(document.createTextNode(text));
  return container;
}

export function SidebarGroupAction(icon) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-group-action");
  container.setAttribute("data-sidebar", "group-action");
  container.className = "sidebar-group-action";
  container.appendChild(icon);
  return container;
}

export function SidebarGroupContent(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sidebar-group-content");
  container.setAttribute("data-sidebar", "group-content");
  container.className = "sidebar-group-content";
  container.append(...elements);
  return container;
}

export function SidebarMenu(...elements) {
  const container = document.createElement("ul");
  container.setAttribute("data-slot", "sidebar-menu");
  container.setAttribute("data-sidebar", "menu");
  container.className = "sidebar-menu";
  container.append(...elements);
  return container;
}

export function SidebarMenuItem(...elements) {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "sidebar-menu-item");
  container.setAttribute("data-sidebar", "menu-item");
  container.className = "sidebar-menu-item";
  container.append(...elements);
  return container;
}

export function SidebarMenuButton({
  label,
  icon,
  active = false,
  options: { size = "default", variant = "default" } = {},
}) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-menu-button");
  container.setAttribute("data-sidebar", "menu-button");
  container.setAttribute("data-size", size);
  container.setAttribute("data-variant", variant);
  container.setAttribute("data-active", String(active));
  container.className = "sidebar-menu-button";

  icon && container.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = label;
  container.appendChild(text);

  return container;
}

export function SidebarMenuAction({ icon, showOnHover = false }) {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sidebar-menu-action");
  container.setAttribute("data-sidebar", "menu-action");
  container.setAttribute("data-hover", String(showOnHover));
  container.className = "sidebar-menu-action";
  container.appendChild(icon);
  return container;
}

export function SidebarMenuBadge(icon) {
  const container = document.createElement("span");
  container.setAttribute("data-slot", "sidebar-menu-badge");
  container.setAttribute("data-sidebar", "menu-badge");
  container.className = "sidebar-menu-badge";
  container.appendChild(icon);
  return container;
}

export function SidebarMenuSub(...elements) {
  const container = document.createElement("ul");
  container.setAttribute("data-slot", "sidebar-menu-sub");
  container.setAttribute("data-sidebar", "menu-sub");
  container.className = "sidebar-menu-sub";
  container.append(...elements);
  return container;
}

export function SidebarMenuSubItem(...elements) {
  const container = document.createElement("li");
  container.setAttribute("data-slot", "sidebar-menu-sub-item");
  container.setAttribute("data-sidebar", "menu-sub-item");
  container.className = "sidebar-menu-sub-item";
  container.append(...elements);
  return container;
}

export function SidebarMenuSubButton({
  label,
  icon,
  isActive = false,
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

  return container;
}
