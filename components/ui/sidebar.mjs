import { createID } from "../../lib/create-id.mjs";
import { createIcon } from "../../lib/create-icon.mjs";
import { Button } from "../ui/button.mjs";

import { PanelLeft, PanelRight } from "../../assets/icons/icons.mjs";

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

  const id = createID("sidebar");

  const sidebar = SidebarInner({ header, content, footer });
  const container = SidebarContainer(sidebar);
  const wrapper = SidebarWrapper(container);

  wrapper.config({ open: isOpen, side, variant, collapsible });

  function toggle() {
    isOpen = !isOpen;
    wrapper.toggle(isOpen);
  }

  function handleKeyDown(event) {
    if (event.key === "b") {
      toggle();
    }
  }

  document.removeEventListener(`sidebar-toggle-${id}`, toggle);
  document.removeEventListener("keydown", handleKeyDown);

  if (collapsible !== "none") {
    document.addEventListener(`sidebar-toggle-${id}`, toggle);
    document.addEventListener("keydown", handleKeyDown);
  }

  return {
    Inset: (element) => SidebarProvider(wrapper, SidebarInset(element)),
    trigger: SidebarTrigger(id, side),
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

function SidebarTrigger(id, side) {
  const iconString = side === "left" ? PanelLeft : PanelRight;

  const icon = createIcon(iconString);

  const trigger = Button({
    label: icon,
    variant: "ghost",
    size: "icon",
    onClick: () => {
      document.dispatchEvent(new CustomEvent(`sidebar-toggle-${id}`));
    },
  });

  trigger.setAttribute("data-slot", "sidebar-trigger");
  trigger.classList.add("sidebar-trigger-button");

  return trigger;
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
