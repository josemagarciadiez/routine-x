import { createID } from "../../lib/create-id.mjs";
import { createIcon } from "../../lib/create-icon.mjs";

export function Select({ trigger, content }) {
  const container = document.createDocumentFragment();

  trigger.setControl(content.id);
  content.setWidth(trigger.width);

  let selectedValue = "";
  let selectedElement = null;

  const markItemAsSelected = (item) => {
    // Desmarcar item seleccionado si hay
    content
      .querySelectorAll(".select-item-check-indicator")
      .forEach((check) => {
        check.style.display = "none";
        check.parentNode.setAttribute("aria-selected", "false");
      });

    // Marca el item actual
    const checkIndicator = item.querySelector(".select-item-check-indicator");

    if (checkIndicator) {
      checkIndicator.style.display = "inline";
      item.setAttribute("aria-selected", "true");
    }
  };

  content.addEventListener("click", (event) => {
    const selectedItem = event.target.closest("li[role='option']");

    if (selectedItem) {
      if (selectedItem.getContent() === selectedElement) {
        trigger.setAttribute("aria-expanded", "false");
        content.hidePopover();
        return; // No hacer nada porque ya esta seleccionado
      }

      selectedValue = selectedItem.dataset.value;
      selectedElement = selectedItem.getContent();

      container.dispatchEvent(new Event("change", { bubbles: true }));

      trigger.update(selectedElement.cloneNode(true));

      markItemAsSelected(selectedItem);

      trigger.setAttribute("aria-expanded", "false");

      content.hidePopover();
    }
  });

  trigger.addEventListener("click", () => {
    content.showPopover();
    trigger.setAttribute("aria-expanded", "true");
  });

  container.appendChild(trigger);
  container.appendChild(content);

  container.getValue = () => selectedValue;

  container.getItem = () => selectedElement;

  container.setError = () => {
    trigger.setAttribute("aria-invalid", "true");
  };

  container.clearError = () => {
    trigger.setAttribute("aria-invalid", "false");
  };

  return container;
}

export function SelectTrigger({ placeholder, size = "default", width }) {
  const container = document.createElement("span");

  container.setAttribute("data-slot", "select-trigger");
  container.setAttribute("aria-haspopup", "listbox");
  container.setAttribute("aria-expanded", "false");
  container.setAttribute("data-size", size);

  container.setControl = function (id) {
    container.setAttribute("aria-controls", id);
    container.setAttribute("popovertarget", id);
    container.style.setProperty("anchor-name", `--anchor-${id}`);
  };

  container.update = function (content) {
    container.setAttribute("data-placeholder", "false");
    container.innerHTML = "";
    container.appendChild(content);
    container.appendChild(icon);
  };

  container.className = "select-trigger";

  container.style.width = width ?? "8rem";

  container.width = width;

  const icon = createIcon("../../assets/icons/chevron-down.svg");
  icon.className = "select-trigger-icon";

  if (placeholder) {
    container.setAttribute("data-placeholder", "true");
    container.appendChild(document.createTextNode(placeholder));
  }

  container.appendChild(icon);

  return container;
}

export function SelectContent({ items }) {
  const id = createID("select-content");

  const container = document.createElement("ul");

  container.setAttribute("role", "listbox");
  container.setAttribute("data-slot", "select-content");
  container.setAttribute("id", id);
  container.setAttribute("popover", "auto");

  container.className = "select-content";

  container.setWidth = (width) => {
    container.style.width = width;
  };

  container.style.setProperty("position-anchor", `--anchor-${id}`);

  items.forEach((item) => {
    container.appendChild(item);
  });

  return container;
}

export function SelectItem({ value, content }) {
  const container = document.createElement("li");

  container.setAttribute("role", "option");
  container.setAttribute("data-slot", "select-item");
  container.setAttribute("data-value", value);

  container.className = "select-item";

  const checkIndicator = createIcon("../../assets/icons/check.svg");
  checkIndicator.className = "select-item-check-indicator";
  checkIndicator.style.display = "none";

  container.appendChild(checkIndicator);

  let child;

  if (content instanceof Node) {
    child = content;
  } else {
    child = document.createTextNode(content);
  }

  container.appendChild(child);

  container.getContent = function () {
    return child;
  };

  return container;
}
