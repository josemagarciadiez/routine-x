import { Label } from "./label.mjs";
import { Input } from "./input.mjs";

export function Form({ fields, submit, onSubmit }) {
  // Crea un nuevo elemento <form> en el DOM.
  const container = document.createElement("form");
  // Agrega la clase base 'form' al <form>.
  container.className = "form";

  // Crea objeto para almacenar las ref de los FormFields.
  const formFields = {};

  // Agrega los childrens (FormFields) al contenedor.
  fields &&
    fields.forEach((field) => {
      // Agrega FormField al contenedor.
      container.appendChild(field);
      // Guarda referencia del campo en variable
      formFields[field.name] = field;
    });

  // Agregar el elemento que hace submit
  submit && container.appendChild(submit);

  // Agregar manejador del evento submit al <form>
  container.addEventListener("submit", (event) => {
    // Evitar comportamiento predeterminado.
    event.preventDefault();

    // Variable local para saber si el form tiene errores.
    let hasErrors = false;
    // Variable global para ir armando la variable formData.
    let formData = {};
    // Recorre los campos guardados en el objeto
    for (const field in formFields) {
      // Guarda el campo en una variable
      const formField = formFields[field];
      // Valida el field
      if (!formField.validate()) {
        hasErrors = true;
      } else {
        formData[field] = formField.value();
      }
    }

    // Si no hay errores, se ejecuta el callback
    if (!hasErrors) {
      onSubmit(formData);

      // TODO: Agregar loader, independientemente de
      // si se manda al servidor o no.
      // submit.textContent = "Ingresando...";

      // Si aca hay un POST,
      // hasta que el server retorne la respuesta,
      // poner un loader en el boton.
      // Una vez recibida la respuesta, si es OK
      // dar acceso al usuario.
      // Si no es OK, mostrar error en la misma
      // pantalla, con los datos que ya estaban.
    }

    // TODO:
    // 1. Agregar defaultValues para inicio del form
    // 2. Agregar metodo reset para volver todos los values a defaultValues.
    // 3. Ver funcionalidad de array de campos.
  });

  // Devuelve el elemento <form> creado y configurado.
  return container;
}

/**
 *
 * @param {HTMLElement} label Elemento HTML para la etiqueta del campo.
 * @param {HTMLElement} control Elemento HTML que controla la entrada del usuario.
 * @param {HTMLElement} message Elemento HTML usado para mostrar fedback al usuario.
 * @param {HTMLElement} description Elemento HTML usado para describir la funcion del campo.
 * @returns
 */
export function FormField({
  name,
  validator,
  item: { label, control, message, description },
}) {
  // Crea un nuevo elemento <div> en el DOM que servira como
  // contenedor de todos los elementos del campo (label, control, message, description, etc)
  const container = document.createElement("div");
  // Setea un atributo para mejor accesibilidad.
  container.setAttribute("data-slot", "form-field");
  // Agrega la clase base 'form-field' al <div>.
  container.className = "form-field";

  if (label) {
    // Emparejar label con control
    label.htmlFor = name;
    // Agregar label al form
    container.appendChild(label);
  }

  if (control) {
    // Configurar el control
    control.id = name;
    control.name = name;
    // Agregar control al form
    container.appendChild(control);
  }

  // Agrega el resto de los childrens al contenedor
  description && container.appendChild(description);
  message && container.appendChild(message);

  // Variables publicas del componente
  container.name = name;

  container.value = function () {
    return control.getValue();
  };

  // Funcion auxiliar para validar el campo
  const validateField = () => {
    // Variable local para saber si el form tiene errores.
    let hasErrors = false;

    // Chequea si recibio una funcion validadora
    if (validator) {
      // Pasa el valor del campo por el validador
      const error = validator(control.getValue());
      // Si se devolvio algo distinto de nulo:
      if (error) {
        // Marca que hay errores,
        hasErrors = true;
        // Muestra el mensaje de error en el campo mensaje.
        message.update(error);
        // Marca con error el label.
        label.setError();
      } else {
        // Si el error es null,
        // marca que no hay errores
        hasErrors = false;
        // Borra el mensaje
        message.update("");
        // Limpia el error del label.
        label.clearError();
      }
    }

    return !hasErrors;
  };

  container.validate = validateField;

  // TODO
  control.addEventListener("change", validateField);

  // Devuelve el elemento <div> creado y configurado.
  return container;
}

/**
 * Define una función que actuará como un constructor para el elemento
 * encargado de mostrar la etiqueta del formulario.
 *
 * @param {HTMLElement} text Cadena de texto para mostrar en la etiqueta.
 * @returns
 */
export function FormLabel({ text }) {
  // Crea un nuevo elemento <label> en el DOM.
  const label = Label({ text });
  // Setea un atributo para mejor accesibilidad.
  label.setAttribute("data-slot", "form-label");

  /**
   * Metodo para actualizar el atributo de estado.
   *
   * Agrega una función directamente al elemento `label`.
   * Esta función (setError) actualiza el atributo "data-error"
   * a true.
   *
   * Esto es utilizado como selector en css para cambiar los
   * estilos de acuerdo al estado del campo.
   */
  label.setError = function () {
    // Setea un atributo para modificar estilos
    label.setAttribute("data-error", "true");
  };

  /**
   * Metodo para actualizar el atributo de estado.
   *
   * Agrega una función directamente al elemento `label`.
   * Esta función (clearError) actualiza el atributo "data-error"
   * a false.
   *
   * Esto es utilizado como selector en css para cambiar los
   * estilos de acuerdo al estado del campo.
   */
  label.clearError = function () {
    // Setea un atributo para modificar estilos
    label.setAttribute("data-error", "false");
  };

  /**
   * Metodo para actualizar el atributo de for.
   *
   * Agrega una función directamente al elemento `label`.
   * Esta función (setFor) toma un string como argumento y
   * actualizará el atributo "for"
   *
   * Esto es utilizado como para emparejar el <label>
   * con el elemento hmtl <input> que corresponda.
   */
  label.setFor = function (htmlFor) {
    label.setAttribute("for", htmlFor);
  };
  // Devuelve el elemento <label> creado y configurado.
  return label;
}

/**
 * Define una función que actuará como un constructor para el elemento
 * encargado de mostrar un mensaje que ayude al usuario a entender la finalidad del campo.
 *
 * @param {String} text Cadena de texto para mostrar en la descripción del campo.
 * @returns
 */
export function FormDescription({ text = "" }) {
  // Crea un nuevo elemento <p> en el DOM.
  const container = document.createElement("p");
  // Setea un atributo para mejor accesibilidad.
  container.setAttribute("data-slot", "form-description");
  // Agrega la clase base 'field-description' al <p>.
  container.className = "form-description";
  // Agrega el texto al contenido del <p>.
  container.textContent = text;
  // Devuelve el elemento <p> creado y configurado.
  return container;
}

/**
 * Define una función que actuará como un constructor para el elemento
 * encargado de mostrar fedback al usuario.
 *
 * @returns HTMLElement
 */
export function FormMessage() {
  // Crea un nuevo elemento <p> en el DOM.
  const container = document.createElement("p");
  // Setea un atributo para mejor accesibilidad.
  container.setAttribute("data-slot", "form-message");
  // Agrega la clase base 'field-message' al <p>.
  container.className = "form-message";
  /**
   * Metodo para actualizar el contenido del mensaje.
   *
   * Agrega una función directamente al elemento `container`.
   * Esta función (udpdate) toma un nuevo mensaje como argumento y
   * actualizará el textContent del elemento <p>.
   *
   * Esto encapsula la lógica para modificar el mensaje dentro del propio elemento.
   */
  container.update = function (newMessage) {
    this.textContent = newMessage;
  };
  // Devuelve el elemento <p> creado y configurado.
  return container;
}

//crea la function ImputPassword, se espera, que retorne una etiqueta Imput
//de tipo password, en la cuál el usuario deberá registrar al menos una mayus, y un numero.
//a su vez, un minimo de 8 carácteres
export function ImputPassword() {
  //crea la constante imPass, y la iguala a la function Imput, la cual retorna una etiqueta imput
  const imPass = Input({
    //se le setean atributos propios de la etiqueta:
    placeholder: "Contraseña", //Dirá contraseña en su interior
    required: true, //lo convierte en un campo obligatorio
    type: "Password", //se le asigna el tipo Password para que los datos ingresados por el usuario permanezcan ocultos
    errors: [], //se carga un array vacio, errors: [], ya que este se manejan dentro de la function Form()
  });
  /**
   * @param {HTMLElement} pattern //Elemento HTML para propiedad del campo imput
   * @returns
   */
  imPass.pattern = "(?=.*[A-Z])(?=.*\\d).{8,}"; //se asigna el atributo pattern, para hacer obligatorio los campos ya mencionados antes de la creacion de la function
  return imPass; //retorna la etiqueta Imput de tipo Password
}
