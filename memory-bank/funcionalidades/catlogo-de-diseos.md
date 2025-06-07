# ✅ Funcionalidad: Catálogo de Diseños

**Descripción:** Permite a los usuarios explorar una colección de diseños de ropa, con opciones para ver diseños generales o los más populares, y añadir diseños al carrito de compras.

**Flujo de Interacción:** El usuario navega a `/catalogo`, donde puede alternar entre ver "DISEÑOS" (todos) y "MÁS POPULARES". Puede interactuar con los diseños (dar "me gusta" y añadir al carrito). También hay una sección para "Publicar Diseño" (aunque la funcionalidad de publicación real no está implementada en esta página).

---

### Archivos Involucrados:

#### 📄 **Archivo:** `src/app/catalogo/page.jsx`
* **Rol:** Página principal del catálogo de diseños.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `ComunidadDiseños` (componente principal), `useCartStorage`, `HeaderPrincipal`, `Footer`.
    * **Lógica Principal:**
        *   Maneja el estado de la pestaña activa (`activo`: 'diseños', 'populares').
        *   Utiliza `mockDesigns` de `src/data/mock/designs.js` para obtener los datos de los diseños (Nota: `activeContext.md` indica que los mocks fueron desactivados, pero este archivo aún los usa).
        *   Filtra los diseños "populares" basándose en un umbral de "likes".
        *   Implementa la lógica de "me gusta" (`handleLike`) con persistencia en `localStorage` y un contador de likes.
        *   Permite añadir diseños al carrito usando `addItem` de `useCartStorage`.
        *   Renderiza los diseños en un formato de "red social" con avatares de usuario y botones de interacción.
        *   Incluye una sección "Publicar Diseño" que es un placeholder.
    * **Modelos de Datos / Endpoints:** Consume `mockDesigns` (datos mock). Interactúa con `useCartStorage` para la gestión del carrito en el cliente.

#### 📄 **Archivo:** `src/app/acciones/DesignActions.js`
* **Rol:** Contiene las Server Actions para la gestión de diseños (CRUD).
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** `guardarDesigns`, `obtenerDesigns`, `RegistrarDesign`, `RegistroMasivoDesigns`, `encontrarDesignsPorId`, `actualizarDesign`, `eliminarDesign`.
    * **Lógica Principal:**
        *   `guardarDesigns` / `RegistrarDesign`: Guarda un nuevo diseño en la base de datos.
        *   `obtenerDesigns`: Recupera todos los diseños de la base de datos.
        *   `RegistroMasivoDesigns`: Permite la carga masiva de diseños a través de un archivo CSV.
        *   `encontrarDesignsPorId`: Busca un diseño específico por su ID.
        *   `actualizarDesign`: Actualiza los datos de un diseño existente.
        *   `eliminarDesign`: Elimina un diseño de la base de datos.
        *   Todas las acciones interactúan directamente con el modelo `Design` de Mongoose y utilizan `revalidatePath` para la invalidación de caché.
    * **Modelos de Datos / Endpoints:** Modifica/consume el modelo `Design` de Mongoose.

#### 📄 **Archivo:** `src/data/mock/designs.js`
* **Rol:** Proporciona datos de diseños de ejemplo (mock data) para el desarrollo y visualización del catálogo.
* **Implementación Clave:**
    * **Componentes/Funciones Relevantes:** Exporta el array `mockDesigns`.
    * **Lógica Principal:** Contiene un array de objetos JavaScript que simulan la estructura de los datos de diseños.
    * **Modelos de Datos / Endpoints:** Datos estáticos, no interactúa con la base de datos.

