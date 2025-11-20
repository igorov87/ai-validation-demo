/**
 * Configuración centralizada de la aplicación
 * Todas las variables de entorno deben estar aquí
 */
export default {
  // URLs de APIs
  API_REQUERIMIENTOS_URL: import.meta.env.VITE_API_REQUERIMIENTOS_URL || 'http://localhost:3000/api',
  API_NOTIFICACIONES_URL: import.meta.env.VITE_API_NOTIFICACIONES_URL || 'https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app',
  
  // Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema de Requerimientos',
  APP_ENV: import.meta.env.MODE || 'development',
  
  // Features flags
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true',
  
  // Timeouts
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
}

