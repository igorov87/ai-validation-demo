import axios from 'axios'
import config from '@/config'

/**
 * Instancia de axios para API de Notificaciones
 */
const notificacionesApi = axios.create({
  baseURL: config.API_NOTIFICACIONES_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de REQUEST
notificacionesApi.interceptors.request.use(
  (config) => {
    // Agregar headers personalizados
    config.headers['X-Application-Name'] = 'requerimientos-frontend'

    // Log de petición en desarrollo
    if (import.meta.env.DEV) {
      console.log(`📧 [Notificaciones API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('❌ Error en notificaciones request:', error)
    return Promise.reject(error)
  }
)

// Interceptor de RESPONSE
notificacionesApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ [Notificaciones API Response] ${response.status}`, response.data)
    }
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      console.error(`❌ [Notificaciones API Error ${status}]`, error.response.data)
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor de notificaciones')
    } else {
      console.error('❌ Error al enviar notificación:', error.message)
    }

    return Promise.reject(error)
  }
)

export default notificacionesApi

