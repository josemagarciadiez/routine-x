import { createID } from "../../lib/create-id.mjs";

export function Switch({ defaultValue = false }) {
  let checked = defaultValue;

  const id = createID("switch");

  const container = document.createDocumentFragment();

  const input = document.createElement("input");
  input.id = id;
  input.type = "checkbox";
  input.className = "switch-primitive-checkbox";

  input.setAttribute("data-state", checked ? "checked" : "unchecked");

  input.addEventListener("click", () => {
    checked = !checked;
    input.setAttribute("data-state", checked ? "checked" : "unchecked");
  });

  // input.disabled = true;

  const label = document.createElement("label");
  label.htmlFor = id;

  container.appendChild(input);
  container.appendChild(label);

  container.getValue = function () {
    return checked;
  };

  container.setField = function (name) {
    input.id = name;
    input.name = name;
  };

  return container;
}
