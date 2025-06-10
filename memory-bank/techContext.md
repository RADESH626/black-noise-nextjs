# Tech Context

## Tecnologías Utilizadas

### Frontend
*   **Next.js (v15.3.1):** Framework de React para la construcción de aplicaciones web con renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y rutas API.
*   **React (v19.1.0):** Librería principal para la construcción de interfaces de usuario interactivas.
*   **Tailwind CSS (v4):** Framework CSS de utilidad para un estilizado rápido y consistente.
*   **Framer Motion (v12.15.0):** Librería para animaciones y transiciones fluidas en la interfaz de usuario.
*   **JavaScript (ES6+):** Lenguaje de programación principal.

### Backend / API
*   **Next.js API Routes / Server Actions:** Utilizados para manejar la lógica del lado del servidor, incluyendo operaciones CRUD y autenticación.
*   **Node.js:** Entorno de ejecución para Next.js.
*   **Mongoose (v8.14.0):** ODM (Object Data Modeling) para MongoDB, facilitando la interacción con la base de datos.
*   **NextAuth.js (v4.24.11):** Librería de autenticación para Next.js, que soporta múltiples estrategias de autenticación.
*   **Bcryptjs (v3.0.2):** Para el hashing seguro de contraseñas.
*   **Nodemailer (v6.10.1):** Para el envío de correos electrónicos (posiblemente para confirmaciones de pedidos, restablecimiento de contraseñas, etc.).

### Base de Datos
*   **MongoDB:** Base de datos NoSQL orientada a documentos, utilizada para almacenar la información del proyecto.

### Herramientas y Librerías Adicionales
*   **Axios (v1.9.0):** Cliente HTTP para realizar solicitudes a APIs.
*   **PapaParse (v5.5.2):** Para el parseo de archivos CSV (posiblemente para carga masiva de datos, como productos o usuarios).
*   **jsPDF (v3.0.1) & jspdf-autotable (v5.0.2):** Para la generación de documentos PDF (posiblemente para facturas, reportes de ventas, etc.).
*   **ESLint (v9):** Herramienta de linting para mantener la calidad y consistencia del código.
*   **npm/yarn:** Gestores de paquetes.

## Entorno de Desarrollo
*   **Prerrequisitos:** Node.js, npm/yarn, instancia de MongoDB.
*   **Configuración:** Uso de variables de entorno (`.env.local`) para la URI de MongoDB, el secreto de NextAuth y la URL de NextAuth.
*   **Ejecución:** `npm run dev` para iniciar el servidor de desarrollo.

## Justificación de Decisiones Clave
*   **Next.js:** Se eligió por su capacidad de renderizado en el servidor (SSR) y generación estática (SSG), lo que es ideal para el SEO de los productos y un rendimiento rápido en el catálogo. Las Server Actions simplifican el backend y permiten una arquitectura full-stack con React.
*   **Tailwind CSS:** Se seleccionó para acelerar el desarrollo de la UI y mantener una consistencia visual sin necesidad de escribir CSS personalizado extensivo, promoviendo un enfoque de "utility-first".
*   **MongoDB con Mongoose:** Se optó por MongoDB debido a su flexibilidad de esquema, ideal para un proyecto que podría evolucionar rápidamente en sus modelos de datos. Mongoose proporciona una capa de abstracción robusta para la interacción con la base de datos.
*   **NextAuth.js:** Elegido por su integración nativa con Next.js y su soporte para múltiples proveedores de autenticación, facilitando la implementación de un sistema de autenticación seguro y escalable.

## Limitaciones Técnicas
*   **Next.js Server Actions/API Routes:** Posibles problemas de "cold start" o límites de tiempo de ejecución en entornos serverless.
*   **Flexibilidad de MongoDB:** Requiere una gestión cuidadosa de los esquemas con Mongoose para evitar inconsistencias de datos.
*   **Autenticación:** La personalización de la lógica de autenticación con NextAuth.js puede requerir una integración profunda.
