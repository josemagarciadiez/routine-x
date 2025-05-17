import { createID } from "../../lib/create-id.mjs";

export function Tooltip({
  trigger,
  content,
  options: { align = "bottom", hidden = false } = {},
}) {
  const tooltipId = createID("tooltip");

  const $trigger = TooltipTrigger(trigger, tooltipId);
  const $content = TooltipPopover(content, tooltipId, align);

  const fragment = document.createDocumentFragment();

  fragment.appendChild($trigger);
  fragment.appendChild($content);

  return fragment;
}

function TooltipTrigger(element, id) {
  //   Attributes
  element.setAttribute("data-slot", "tooltip-trigger");

  //   Anchor property
  element.style.setProperty("anchor-name", `--anchor-${id}`);

  //   Events
  element.addEventListener("mouseenter", () => {
    const popover = document.getElementById(id);
    if (popover) {
      popover.showPopover();
    }
  });

  element.addEventListener("mouseleave", () => {
    const popover = document.getElementById(id);
    if (popover) {
      popover.hidePopover();
    }
  });

  return element;
}

function TooltipPopover(element, id, align) {
  // Attributes
  element.setAttribute("data-slot", "tooltip-popover");
  element.setAttribute("data-align", align);
  element.setAttribute("popover", "manual");
  element.setAttribute("id", id);
  //   Anchor property
  element.style.setProperty("position-anchor", `--anchor-${id}`);

  return element;
}

export function TooltipContent({ content, className }) {
  const container = document.createElement("span");
  //   Attributes
  container.setAttribute("data-slot", "tooltip-content");
  container.setAttribute("role", "tooltip");
  // Styles
  container.className = `tooltip-content ${className}`;
  // Children
  if (content instanceof Node) {
    container.appendChild(content);
  } else {
    container.appendChild(document.createTextNode(content));
  }

  return container;
}
