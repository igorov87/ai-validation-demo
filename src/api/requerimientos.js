import axios from 'axios'
import config from '@/config'

/**
 * Instancia de axios para la API de Requerimientos
 * Configurada con interceptores para autenticación y manejo de errores
 */
const requerimientosApi = axios.create({
  baseURL: config.API_REQUERIMIENTOS_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de REQUEST
requerimientosApi.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Agregar headers personalizados
    config.headers['X-Application-Name'] = 'requerimientos-frontend'

    // Sanitizar parámetros de query
    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (typeof config.params[key] === 'string') {
          config.params[key] = config.params[key].trim()
        }
      })
    }

    // Log de petición en desarrollo
    if (config.ENABLE_LOGS) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    // Verificar conectividad
    if (!navigator.onLine) {
      console.warn('⚠️ Navegador sin conexión a internet')
    }

    return config
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor de RESPONSE
requerimientosApi.interceptors.response.use(
  (response) => {
    // Log de respuesta exitosa en desarrollo
    if (config.ENABLE_LOGS) {
      console.log(`✅ [API Response] ${response.status}`, response.data)
    }
    return response
  },
  (error) => {
    // Manejo de errores HTTP
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      // Log detallado en desarrollo, mínimo en producción
      if (config.ENABLE_LOGS) {
        console.error(`❌ [API Error ${status}]`, message)
      } else {
        console.error(`❌ API Error ${status}`)
      }

      // Manejo específico por código de error
      switch (status) {
        case 401:
          // Sesión expirada
          localStorage.clear()
          window.location.href = '/login?error=sesion-expirada'
          break
        
        case 403:
          console.warn('⚠️ Acceso denegado')
          break
        
        case 404:
          console.warn('⚠️ Recurso no encontrado')
          break
        
        case 422:
          console.warn('⚠️ Error de validación')
          break
        
        case 500:
        case 502:
        case 503:
          console.error('🔥 Error del servidor')
          break
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ No se recibió respuesta del servidor')
    } else {
      // Error en la configuración
      console.error('❌ Error al configurar la petición:', error.message)
    }

    return Promise.reject(error)
  }
)

export default requerimientosApi

