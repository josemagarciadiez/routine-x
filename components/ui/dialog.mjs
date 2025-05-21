import { X } from "../../assets/icons/icons.mjs";
import { createIcon } from "../../lib/create-icon.mjs";
import { createID } from "../../lib/create-id.mjs";
import { createPortal } from "../../lib/create-portal.mjs";

export function Dialog({ trigger, content }) {
  let portal = null;
  let isOpen = false;

  const id = createID("dialog");
  const appOverflow = document.body.style.overflow;

  trigger.setTarget(id);
  content.id = id;

  function handleOpen() {
    if (isOpen) {
      return;
    }

    isOpen = true;

    portal = DialogPortal(content, id);

    if (portal) {
      portal.setState("open");
      document.body.style.overflow = "hidden";
    }

    document.addEventListener(`dialog-close-${id}`, handleClose);
    document.addEventListener("keydown", handleKeyDown);
  }

  function handleClose() {
    if (!isOpen || !portal) {
      return;
    }

    isOpen = false;

    document.removeEventListener(`dialog-close-${id}`, handleClose);
    document.removeEventListener("keydown", handleKeyDown);

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

  document.addEventListener(`dialog-open-${id}`, handleOpen);

  trigger.open = handleOpen;
  trigger.close = handleClose;

  return trigger;
}

function DialogPortal(element, id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dialog-portal");
  const overlay = DialogOverlay(id);
  container.appendChild(overlay);
  container.appendChild(element);
  container.setState = function (state) {
    overlay.setAttribute("data-state", state);
    element.setAttribute("data-state", state);
  };
  return createPortal(container);
}

function DialogOverlay(id) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dialog-overlay");
  container.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent(`dialog-close-${id}`));
  });
  container.className = "dialog-overlay";
  return container;
}

export function DialogTrigger(element) {
  element.setAttribute("data-slot", "dialog-trigger");
  element.setTarget = function (id) {
    element.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent(`dialog-open-${id}`));
    });
  };
  return element;
}

export function DialogClose(element) {
  element.setAttribute("data-slot", "dialog-close");
  element.addEventListener("click", () => {
    const content = element.closest("[data-slot='dialog-content']");
    if (content) {
      document.dispatchEvent(new CustomEvent(`dialog-close-${content.id}`));
    }
  });
  return element;
}

export function DialogContent({ header, footer, content, classList = "" }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dialog-content");
  container.className = "dialog-content";
  container.classList.add(...classList);
  container.appendChild(DialogPrimitiveClose());
  // Childrens
  header && container.appendChild(header);

  if (content) {
    const wrapper = document.createElement("div");
    wrapper.className = "dialog-content-inner-wrapper";
    wrapper.appendChild(content);
    container.appendChild(wrapper);
  }

  footer && container.appendChild(footer);

  return container;
}

function DialogPrimitiveClose() {
  const container = document.createElement("button");
  container.setAttribute("data-slot", "dialog-close");
  container.className = "dialog-primitive-close";
  container.addEventListener("click", () => {
    const content = container.closest("[data-slot='dialog-content']");
    if (content) {
      document.dispatchEvent(new CustomEvent(`dialog-close-${content.id}`));
    }
  });
  const icon = createIcon(X);
  container.appendChild(icon);
  return container;
}

export function DialogHeader(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dialog-header");
  container.className = "dialog-header";
  container.append(...elements);
  return container;
}

export function DialogFooter(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "dialog-footer");
  container.className = "dialog-footer";
  container.append(...elements);
  return container;
}

export function DialogTitle(title) {
  const container = document.createElement("h3");
  container.setAttribute("data-slot", "dialog-title");
  container.className = "dialog-title";
  container.textContent = title;
  return container;
}

export function DialogDescription(description) {
  const container = document.createElement("p");
  container.setAttribute("data-slot", "dialog-description");
  container.className = "dialog-description";
  container.textContent = description;
  return container;
}
