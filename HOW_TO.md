# Guías del Proyecto

Esta guía tiene como objetivo recopilar todos los tutoriales y procedimientos necesarios para trabajar y contribuir en este proyecto. Aquí encontrarás instrucciones paso a paso para realizar tareas comunes y entender aspectos importantes del flujo de trabajo.

## Índice de Tutoriales

Aquí se listarán todos los tutoriales disponibles en esta guía. Haz clic en el enlace para ir directamente a la sección deseada.

- [Creación e integración de Iconos SVG](#creación-e-integración-de-iconos-svg)

- ... (Aquí se irán agregando más enlaces a medida que se creen tutoriales)

## Creación e integración de Iconos SVG

Este tutorial describe el proceso para crear e integrar iconos SVG personalizados en este proyecto, utilizando la librería [Lucide Icons](https://lucide.dev/icons/) como fuente principal.

**Paso 1: Navegar a Lucide Icons**

Abre tu navegador web y dirígete a la página de [Lucide Icons](https://lucide.dev/icons/).

**Paso 2: Buscar el Icono Deseado**

Utiliza la barra de búsqueda en la parte superior de la página para encontrar el icono que necesitas. Explora las diferentes categorías si es necesario.

**Paso 3: Copiar el Código SVG**

Una vez que encuentres el icono deseado, haz clic en él. En la barra de tareas, presiona el boton "Copy to SVG". Esto copiará automáticamente el código SVG del icono al portapapeles de tu sistema.

**Paso 4: Editar el Archivo `icons.mjs`**

Dentro de la estructura del proyecto, navega hasta el directorio `/assets/icons/` y localiza el archivo llamado `icons.mjs`, y ábrelo con el editor de código.

**Paso 5: Crear la Función del Icono**

Dentro de `icons.mjs`, crea una función de flecha (arrow function) con el nombre del icono que has seleccionado. Es importante seguir la convención de nomenclatura: cada palabra del nombre del icono debe comenzar con una letra mayúscula. Esta función debe devolver el string del código SVG que copiaste en el Paso 3.

```js
// Ejemplo para el icono "home"
export const Home = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
`;
```

```js
// Ejemplo para el icono "Settings"
export const Settings = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings">
<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
<circle cx="12" cy="12" r="3"/>
</svg>
`;
```

**¡Importante!** Asegúrate de pegar el contenido del portapapeles dentro de las comillas invertidas (backticks) de la función.

**Paso 6: Utilizar el Icono en Componentes**

En el componente donde deseas mostrar el icono, importa la función `createIcon` desde el archivo `/lib/create-icon.mjs`. Luego, llama a esta función pasándole como argumento la función del icono que creaste en el Paso 5. Esto devolverá un elemento HTML (un nodo SVG) que puedes manipular directamente en tu componente.

```js
import { createIcon } from "/lib/create-icon.mjs";
import { Home } from "/assets/icons/icons.mjs";

export function MiComponente() {
  const homeIcon = createIcon(Home);

  // Puedes agregar el icono al DOM de tu componente
  const miElemento = document.createElement("div");
  miElemento.appendChild(homeIcon);

  return miElemento;
}
```

**Paso 7: Agregar Clases CSS al Icono**

Si necesitas aplicar estilos CSS específicos al icono, utiliza la propiedad `classList.add()` del elemento SVG devuelto por `createIcon`. No utilices la propiedad `.className` para agregar clases, ya que obtendras un `TypeError: Cannot set property`.

```js
import { createIcon } from "/lib/create-icon.mjs";
import { Home } from "/assets/icons/icons.mjs";

export function OtroComponente() {
  const homeIcon = createIcon(Home);
  homeIcon.classList.add("mi-clase-de-icono");
  homeIcon.classList.add("otro-estilo");

  const miElemento = document.createElement("div");
  miElemento.appendChild(homeIcon);

  return miElemento;
}
```
