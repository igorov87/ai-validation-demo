/**
 * Configuración centralizada de la aplicación
 * Todas las variables de entorno deben estar aquí
 */
export default {
  // URLs de APIs
  API_REQUERIMIENTOS_URL: import.meta.env.VITE_API_REQUERIMIENTOS_URL || 'http://localhost:3000/api',
  
  // API de Notificaciones de Interseguro (según Confluence - Gobierno de APIs)
  // UAT: https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app
  // PRD: https://is-cr-notify-api-notify-master-m3pd7zj7mq-uc.a.run.app
  API_CORREO_URL: import.meta.env.VITE_API_CORREO_URL || 'https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app',
  
  // Configuración de la aplicación
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema de Requerimientos',
  APP_ENV: import.meta.env.MODE || 'development',
  
  // Features flags
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true' || import.meta.env.MODE === 'development',
  
  // Timeouts
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  
  // Notificaciones
  NOTIFICATION_DURATION: parseInt(import.meta.env.VITE_NOTIFICATION_DURATION || '3000'),
  
  // Configuración de correo
  CORREO_FROM_EMAIL: import.meta.env.VITE_CORREO_FROM_EMAIL || 'requerimientos@interseguro.com.pe',
  CORREO_FROM_NAME: import.meta.env.VITE_CORREO_FROM_NAME || 'Sistema de Requerimientos - Interseguro'
}

