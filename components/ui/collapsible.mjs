import { createID } from "../../lib/create-id.mjs";

export function Collapsible(trigger) {
  let isOpen = false;

  let $content = null;

  const id = createID("collapsible");

  const $trigger = CollapsibleTrigger(trigger, id);

  function handleOpen() {
    if (isOpen || !$content) {
      return;
    }

    isOpen = true;

    $trigger.toggle(isOpen);
    $content.toggle(isOpen);
  }

  function handleClose() {
    if (!isOpen || !$content) {
      return;
    }

    isOpen = false;

    $trigger.toggle(isOpen);
    $content.toggle(isOpen);
  }

  const toggle = () => {
    isOpen ? handleClose() : handleOpen();
  };

  document.addEventListener(`collapsible-toggle-${id}`, toggle);

  return {
    trigger: $trigger,
    Content: (content) => {
      // Se guarda el contenido en el estado interno
      $content = CollapsibleContent(content);
      // Se oculta por defecto
      $content.toggle(isOpen);

      return $content;
    },
  };
}

function CollapsibleTrigger(element, id) {
  element.setAttribute("data-slot", "collapsible-trigger");
  element.setAttribute("data-state", "closed");
  element.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent(`collapsible-toggle-${id}`));
  });
  element.toggle = function (state) {
    element.setAttribute("data-state", state ? "open" : "closed");
  };
  return element;
}

function CollapsibleContent(element) {
  const display = element.style.display;
  element.setAttribute("data-slot", "collapsible-content");
  element.setAttribute("data-state", "closed");
  element.toggle = function (state) {
    if (state) {
      element.setAttribute("data-state", "open");
      element.style.display = display;
    } else {
      element.setAttribute("data-state", "closed");
      element.style.display = "none";
    }
  };
  return element;
}
