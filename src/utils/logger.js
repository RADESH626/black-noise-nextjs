// src/utils/logger.js
<<<<<<< HEAD
=======
console.log('Logger module loaded.'); // Temporary debug log

>>>>>>> c32cb53 (primer commit)
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Obtener el nivel de log configurado desde las variables de entorno
// Por defecto, si no está definido, se establece en INFO para evitar logs excesivos en producción
const currentLogLevel = LOG_LEVELS[process.env.NEXT_PUBLIC_LOG_LEVEL] || LOG_LEVELS.INFO;

const logger = {
  _log: (level, ...args) => {
<<<<<<< HEAD
    if (LOG_LEVELS[level] >= currentLogLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `${timestamp} [${level}]`;
=======
    console.log(`Attempting to log: ${level}`, ...args); // Temporary debug log
    if (LOG_LEVELS[level] >= currentLogLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level}]`;
>>>>>>> c32cb53 (primer commit)

      // Determinar el método de console a usar
      let consoleMethod = console.log;
      if (level === 'WARN') {
        consoleMethod = console.warn;
      } else if (level === 'ERROR') {
        consoleMethod = console.error;
      } else if (level === 'DEBUG') {
        consoleMethod = console.debug;
      }

      // Añadir el prefijo y luego los argumentos originales
      consoleMethod(prefix, ...args);
    }
  },

  debug: (...args) => logger._log('DEBUG', ...args),
  info: (...args) => logger._log('INFO', ...args),
  warn: (...args) => logger._log('WARN', ...args),
  error: (...args) => logger._log('ERROR', ...args),
};

export default logger;
