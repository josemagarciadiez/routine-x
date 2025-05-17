import { createIcon } from "../../lib/create-icon.mjs";
import { createID } from "../../lib/create-id.mjs";
import { createPortal } from "../../lib/create-portal.mjs";

export function Sheet({ trigger, content }) {
  let portal = null;
  let isOpen = false;

  const id = createID("sheet");
  const appOverflow = document.body.style.overflow;

  trigger.setTarget(id);
  content.id = id;

  function handleOpen() {
    if (isOpen) {
      return;
    }

    isOpen = true;

    portal = SheetPortal(content, id);

    if (portal) {
      portal.setState("open");
      document.body.style.overflow = "hidden";
    }

    document.addEventListener(`sheet-close-${id}`, handleClose);
    document.addEventListener("keydown", handleKeyDown);
  }

  function handleClose() {
    if (!isOpen || !portal) {
      return;
    }

    isOpen = false;

    document.removeEventListener(`sheet-close-${id}`, handleClose);
    document.removeEventListener("keydown", handleClose);

    if (portal) {
      portal.setState("closed");
      portal.close();
      document.body.style.overflow = appOverflow;
    }

    portal = null;
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  document.addEventListener(`sheet-open-${id}`, handleOpen);

  trigger.open = handleOpen;
  trigger.close = handleClose;

  return trigger;
}

function SheetPortal(element, id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sheet-portal");
  const overlay = SheetOverlay(id);
  container.appendChild(overlay);
  container.appendChild(element);
  container.setState = function (state) {
    overlay.setAttribute("data-state", state);
    element.setAttribute("data-state", state);
  };
  return createPortal(container);
}

function SheetOverlay(id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sheet-overlay");
  container.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent(`sheet-close-${id}`));
  });
  container.className = "sheet-overlay";
  return container;
}

export function SheetTrigger(element) {
  element.setAttribute("data-slot", "sheet-trigger");
  element.setTarget = function (id) {
    element.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent(`sheet-open-${id}`));
    });
  };
  return element;
}

export function SheetContent({
  header,
  footer,
  content,
  options: { side = "right", classList = "" } = {},
}) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sheet-content");
  container.setAttribute("data-side", side);
  container.className = "sheet-content";
  container.classList.add(...classList);
  container.appendChild(SheetPrimitiveClose());
  // Childrens
  header && container.appendChild(header);

  if (content) {
    const wrapper = document.createElement("div");
    wrapper.className = "sheet-content-inner-wrapper";
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  }

  footer && container.appendChild(footer);

  return container;
}

export function SheetClose(element) {
  element.setAttribute("data-slot", "sheet-close");
  element.addEventListener("click", () => {
    const content = element.closest("[data-slot='sheet-content']");
    if (content) {
      document.dispatchEvent(new CustomEvent(`sheet-close-${content.id}`));
    }
  });
  return element;
}

function SheetPrimitiveClose() {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "sheet-close");
  container.className = "sheet-primitive-close";
  container.addEventListener("click", () => {
    const content = container.closest("[data-slot='sheet-content']");
    if (content) {
      document.dispatchEvent(new CustomEvent(`sheet-close-${content.id}`));
    }
  });
  const icon = createIcon("../../assets/icons/x.svg");
  container.appendChild(icon);
  return container;
}

export function SheetHeader(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sheet-header");
  container.className = "sheet-header";
  container.append(...elements);
  return container;
}

export function SheetFooter(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "sheet-footer");
  container.className = "sheet-footer";
  container.append(...elements);
  return container;
}

export function SheetTitle(title) {
  const container = document.createElement("h3");
  container.setAttribute("data-slot", "sheet-title");
  container.className = "sheet-title";
  container.textContent = title;
  return container;
}

export function SheetDescription(description) {
  const container = document.createElement("p");
  container.setAttribute("data-slot", "sheet-description");
  container.className = "sheet-description";
  container.textContent = description;
  return container;
}
