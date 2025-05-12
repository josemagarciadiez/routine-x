import { Button } from "./button.mjs";
import { Input } from "./input.mjs";
import { Label } from "./label.mjs";

export function defId() {
  const numbers = "0123456789";
  let id = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    id += numbers[randomIndex];
  }
  console.log("id generada exitosamente: " + id);
  idCreadas.push(id);
  return id;
}

export function FormField({ label, controlledInput }) {
  const contentForm = document.createElement("div"); //crea un div para contener el label y los inputs

  if (label) {
    contentForm.appendChild(label);
  }
  if (controlledInput) {
    contentForm.appendChild(controlledInput);
  }
  if (!controlledInput) {
    console.error("No agregaste un input!"); // agregar ref cuando sea posible
  }

  return contentForm; //retorna el div con los componentes ya cargados
}

export function Form({ props = {}, fields, onSubmit }) {
  const form = document.createElement("form"); //crea la etiqueta form

  //asigna atributos generales del form
  if (props) {
    // si el parametro props en un valor true, entonces
    for (const key in props) {
      form.setAttribute(key, props[key]);
    }
  }

  //añade los campos asignados por el parametro field
  fields.forEach((field) => {
    form.appendChild(field);
  });

  const btn = Button({ label: "Enviar" }); //crea una etiqueta botón
  form.appendChild(btn); //carga botón el en form
  try {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      if (onSubmit) {
        onSubmit(data);
      }
    });
  } catch (error) {
    console.error("Error al cargar " + id + ",error: " + error.message);
  }

  return form;
}
