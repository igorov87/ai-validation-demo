import axios from 'axios'
import config from '@/config'

/**
 * Instancia de axios para API de Requerimientos
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

    // Log de petición en desarrollo
    if (import.meta.env.DEV) {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`)
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
    if (import.meta.env.DEV) {
      console.log(`✅ [API Response] ${response.status}`, response.data)
    }
    return response
  },
  (error) => {
    // Manejo de errores HTTP
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      console.error(`❌ [API Error ${status}]`, message)

      // Manejo específico por código de error
      switch (status) {
        case 401:
          localStorage.clear()
          console.warn('⚠️ Sesión expirada')
          break
        
        case 403:
          console.warn('⚠️ Acceso denegado')
          break
        
        case 404:
          console.warn('⚠️ Recurso no encontrado')
          break
        
        case 500:
        case 502:
        case 503:
          console.error('🔥 Error del servidor')
          break
      }
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor')
    } else {
      console.error('❌ Error al configurar la petición:', error.message)
    }

    return Promise.reject(error)
  }
)

export default requerimientosApi

