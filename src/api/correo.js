import axios from 'axios'
import config from '@/config'

/**
 * Instancia de axios para la API de Correo
 * Configurada con interceptores para autenticación y manejo de errores
 */
const correoApi = axios.create({
  baseURL: config.API_CORREO_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de REQUEST
correoApi.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Agregar headers personalizados
    config.headers['X-Application-Name'] = 'requerimientos-frontend'

    // Log de petición en desarrollo
    if (config.ENABLE_LOGS) {
      console.log(`📧 [Correo API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor de RESPONSE
correoApi.interceptors.response.use(
  (response) => {
    // Log de respuesta exitosa en desarrollo
    if (config.ENABLE_LOGS) {
      console.log(`✅ [Correo API Response] ${response.status}`, response.data)
    }
    return response
  },
  (error) => {
    // Manejo de errores HTTP
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      if (config.ENABLE_LOGS) {
        console.error(`❌ [Correo API Error ${status}]`, message)
      } else {
        console.error(`❌ Correo API Error ${status}`)
      }
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor de correo')
    } else {
      console.error('❌ Error al configurar la petición de correo:', error.message)
    }

    return Promise.reject(error)
  }
)

export default correoApi

