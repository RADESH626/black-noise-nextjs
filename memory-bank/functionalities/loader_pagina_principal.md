## Implementación de "Loader" en la Página Principal

### Descripción
Esta funcionalidad implementa un "loader" en la página principal (index o home) del proyecto Next.js / React. El "loader" se muestra durante los primeros 2-3 segundos del renderizado inicial o hasta que el contenido esté completamente cargado, proporcionando una experiencia de usuario más fluida.

### Requisitos funcionales
*   Mostrar un componente `<Loader />` durante los primeros 2–3 segundos del renderizado inicial o hasta que el contenido esté completamente cargado.
*   Fondo negro (`#000`) que ocupe el 100 % del viewport (`width: 100vw; height: 100vh;`).
*   Texto centrado vertical y horizontalmente con la frase "Black Noise" en blanco (`#fff`).
*   Animación suave para el texto (por ejemplo, un fade-in seguido de un pulse o scale), implementada con CSS (`@keyframes`) o librería de animaciones como Framer Motion.
*   Transición limpia al contenido principal: una vez cumplido el tiempo (2–3 s) o cargados los datos, el `<Loader />` debe desaparecer con un fade-out para revelar el home.

### Detalles técnicos
*   Estructura de ficheros:
    *   `components/Loader.jsx` (o `.tsx`)
    *   `styles/Loader.module.css` (o usar styled-jsx / styled-components)
*   Modificar `pages/index.jsx` para importar y renderizar el loader condicionalmente.
*   Estado y lógica:
    *   En `index.jsx`, usar un `useState(false)` para `isLoading` y un `useEffect` que ejecute `setTimeout(() => setIsLoading(false), 2500);`.
    *   Mientras `isLoading === true`, renderizar solo `<Loader />`; cuando cambie a `false`, renderizar el contenido normal del home.
*   Animación CSS de ejemplo:
    ```css
    @keyframes fadeInOut {
      0% { opacity: 0; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(0.9); }
    }
    .loaderText {
      animation: fadeInOut 2s ease-in-out infinite;
    }
    ```
*   Consideraciones de integración:
    *   No modificar el CSS global ni romper selectores existentes.
    *   Envolver el `<Loader />` en un contenedor con `position: fixed; top: 0; left: 0; z-index: 9999;` para que siempre esté por encima.
    *   Limpiar el `setTimeout` en el `useEffect` devolviendo un `clearTimeout`.

### Archivos a modificar
*   `src/app/page.jsx`
*   `src/components/Loader.jsx`
*   `src/styles/Loader.module.css`

### Próximos Pasos
1.  Crear el componente `Loader.jsx` con su respectivo CSS.
2.  Modificar `src/app/page.jsx` para importar y renderizar el loader condicionalmente.
