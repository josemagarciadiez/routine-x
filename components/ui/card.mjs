export function Card({ header, content, footer }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "card");
  container.className = "card-container";
  header && container.appendChild(header);
  content && container.appendChild(content);
  footer && container.appendChild(footer);
  return container;
}

export function CardHeader(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "card-header");
  container.className = "card-header";
  container.append(...elements);
  return container;
}

export function CardFooter(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "card-footer");
  container.className = "card-footer";
  container.append(...elements);
  return container;
}

export function CardContent(...elements) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "card-content");
  container.className = "card-content";
  container.append(...elements);
  return container;
}

export function CardTitle(title) {
  const container = document.createElement("h3");
  container.setAttribute("data-slot", "card-title");
  container.className = "card-title";
  container.textContent = title;
  return container;
}

export function CardDescription(description) {
  const container = document.createElement("h3");
  container.setAttribute("data-slot", "card-description");
  container.className = "card-description";
  container.textContent = description;
  return container;
}

export function CardAction({ trigger, action }) {
  const container = document.createElement("div");
  container.setAttribute("data-slot", "card-action");
  container.className = "card-action";
  if (trigger) {
    container.appendChild(trigger);
    action && trigger.addEventListener("click", action);
  }
  return container;
}
