import { Form, FormField } from "../components/ui/form.mjs";
import { Input } from "../components/ui/input.mjs";
import { Label } from "../components/ui/label.mjs";

const fields = [
  { name: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre" },
  { name: "email", label: "Correo", type: "email", placeholder: "Tu correo" },
  { name: "edad", label: "Edad", type: "number", placeholder: "Tu edad" },
];

function Page() {
  const contenedor = document.createElement("div");

  const form = Form({
    fields: [
      FormField({
        label: Label({ label: "Nombre", htmlFor: "nombre" }),
        controlledInput: Input({ name: "nombre", id: "nombre" }),
      }),
    ],
    onSubmit: (data) => {
      alert(JSON.stringify(data));
    },
  });
  contenedor.appendChild(form);

  return contenedor;
}

document.getElementById("app").appendChild(Page());
