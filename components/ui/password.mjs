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