# Guía de Depuración y Mejores Prácticas

Esta guía describe las convenciones y herramientas para una depuración eficiente en el proyecto, asegurando que los mensajes de log sean informativos y controlables.

## 1. Utilidad de Logging Centralizada (`src/utils/logger.js`)

Hemos implementado una utilidad de logging para estandarizar la forma en que registramos información, advertencias, errores y mensajes de depuración. Esta utilidad añade automáticamente contexto a tus logs y permite controlar la verbosidad.

### Niveles de Logging

La utilidad soporta los siguientes niveles de logging, en orden de severidad:

*   **`logger.debug(...args)`**: Mensajes detallados para depuración. Solo visibles en entornos de desarrollo.
*   **`logger.info(...args)`**: Información general sobre el flujo de la aplicación. Útil para rastrear eventos importantes.
*   **`logger.warn(...args)`**: Advertencias sobre posibles problemas que no detienen la ejecución pero que deben ser revisados.
*   **`logger.error(...args)`**: Errores críticos que indican un fallo en la aplicación o en una operación.

### Uso

En lugar de usar `console.log`, `console.warn`, `console.error` directamente, importa y usa la utilidad `logger`:

```javascript
import logger from '@/utils/logger';

// Ejemplo de uso:
logger.debug('Variables de usuario:', { user, token });
logger.info('Usuario autenticado correctamente', userId);
logger.warn('Falta el campo de email en el formulario de registro');
logger.error('Error al guardar datos en la base de datos', error);
```

### Configuración de la Verbosidad

La visibilidad de los logs se controla mediante la variable de entorno `NEXT_PUBLIC_LOG_LEVEL`. Esta variable debe definirse en tu archivo `.env.local` (para desarrollo) o en la configuración de tu entorno de despliegue (para producción).

Los valores posibles para `NEXT_PUBLIC_LOG_LEVEL` son: `DEBUG`, `INFO`, `WARN`, `ERROR`.

*   **`NEXT_PUBLIC_LOG_LEVEL=DEBUG`**: Muestra todos los logs (debug, info, warn, error). Ideal para desarrollo.
*   **`NEXT_PUBLIC_LOG_LEVEL=INFO`**: Muestra logs de info, warn y error.
*   **`NEXT_PUBLIC_LOG_LEVEL=WARN`**: Muestra logs de warn y error.
*   **`NEXT_PUBLIC_LOG_LEVEL=ERROR`**: Muestra solo logs de error. Ideal para producción.

**Ejemplo en `.env.local`:**

```
NEXT_PUBLIC_LOG_LEVEL=DEBUG
```

## 2. Manejo de Errores Mejorado

*   **Bloques `try-catch`:** Utiliza `try-catch` para manejar errores en operaciones que puedan fallar (ej. llamadas a API, operaciones de base de datos).
*   **Contexto en Errores:** Cuando captures un error, usa `logger.error()` y asegúrate de incluir el error original y cualquier contexto relevante (ej. parámetros de la función, estado de la aplicación).

    ```javascript
    import logger from '@/utils/logger';

    async function fetchData(id) {
        try {
            const response = await fetch(`/api/data/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            logger.error(`Error al obtener datos para ID: ${id}`, error);
            // Puedes relanzar el error o manejarlo de otra manera
            throw error;
        }
    }
    ```

## 3. Herramientas de Depuración

*   **Herramientas de Desarrollo del Navegador:** Utiliza la consola, el inspector de elementos y el depurador de JavaScript del navegador para inspeccionar el DOM, la red y el flujo de ejecución.
*   **Depurador de VS Code:** Configura y utiliza el depurador integrado de VS Code para establecer puntos de interrupción, inspeccionar variables y recorrer el código paso a paso.

Siguiendo estas directrices, podemos mantener un sistema de depuración limpio, informativo y controlable.
