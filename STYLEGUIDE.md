# Guía de Estilo de Black Noise

Esta guía define los principios visuales y componentes base para la interfaz de usuario de la aplicación "Black Noise", asegurando consistencia y usabilidad.

## 1. Paleta de Colores

### Primario
- **`--color-primary`**: `#6B46C1` (Un violeta vibrante para acciones clave y elementos interactivos)

### Neutrales (Escala de Grises)
- **`--color-gray-50`**: `#F9FAFB` (Gris muy claro, para fondos sutiles)
- **`--color-gray-100`**: `#F3F4F6` (Gris claro, para fondos y bordes ligeros)
- **`--color-gray-200`**: `#E5E7EB` (Gris medio-claro, para bordes y separadores)
- **`--color-gray-500`**: `#6B7280` (Gris medio, para texto secundario y iconos)
- **`--color-gray-900`**: `#111827` (Gris oscuro, para texto principal y fondos oscuros)

### Semántica
- **`--color-success`**: `#10B981` (Verde para mensajes de éxito y confirmaciones)
- **`--color-error`**: `#EF4444` (Rojo para mensajes de error y acciones destructivas)
- **`--color-warning`**: `#F59E0B` (Amarillo/Naranja para advertencias y notificaciones)

## 2. Tipografía

**Fuente Principal**: Inter (Configurada a través de Tailwind CSS)

### Escala Tipográfica (Clases de Tailwind CSS)
- **`text-base`**: `1rem` (16px) - Para párrafos de texto general, etiquetas de formulario y elementos de lista.
- **`text-lg`**: `1.125rem` (18px) - Para texto de apoyo, descripciones cortas o elementos de interfaz ligeramente más prominentes.
- **`text-xl`**: `1.25rem` (20px) - Para subtítulos de sección o elementos importantes que requieren un poco más de énfasis.
- **`text-2xl`**: `1.5rem` (24px) - Para títulos de sección principales o encabezados de tarjetas.
- **`text-4xl`**: `2.25rem` (36px) - Para títulos de página o encabezados de gran impacto.

## 3. Componentes Base

### Bordes
- **Radio de Borde Estándar**: `rounded-lg` (8px) - Aplicado a la mayoría de los elementos con bordes, como tarjetas, botones e inputs.

### Sombras
- **Sombra Estándar**: `shadow-md` - Aplicada a elementos elevados como tarjetas, modales y menús desplegables para dar profundidad.
