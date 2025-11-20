import requerimientosApi from '@/api/requerimientos'

/**
 * Constantes de validación
 */
const LIMITES = {
  NOMBRE_CLIENTE: 100,
  NUMERO_POLIZA: 50,
  TELEFONO: 15,
  EMAIL: 100,
  DESCRIPCION: 5000,
  OBSERVACIONES: 2000
}

const TIPOS_REQUERIMIENTO = ['reclamo', 'solicitud', 'consulta', 'queja', 'sugerencia']
const PRIORIDADES = ['baja', 'media', 'alta', 'urgente']

/**
 * Utilidades de sanitización
 */
const sanitizarTexto = (texto, maxLength = 1000) => {
  if (!texto) return ''
  
  let sanitizado = texto.trim()
  sanitizado = sanitizado.substring(0, maxLength)
  
  return sanitizado
}

const sanitizarEmail = (email) => {
  if (!email) return ''
  return email.trim().toLowerCase()
}

const sanitizarTelefono = (telefono) => {
  if (!telefono) return ''
  return telefono.replace(/\D/g, '')
}

const sanitizarNumeroPoliza = (numeroPoliza) => {
  if (!numeroPoliza) return ''
  return numeroPoliza.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
}

/**
 * Sanitiza un objeto completo de requerimiento
 */
const sanitizarRequerimiento = (data) => {
  return {
    tipo: data.tipo,
    nombreCliente: sanitizarTexto(data.nombreCliente, LIMITES.NOMBRE_CLIENTE),
    numeroPoliza: sanitizarNumeroPoliza(data.numeroPoliza),
    telefono: sanitizarTelefono(data.telefono),
    email: sanitizarEmail(data.email),
    prioridad: data.prioridad,
    descripcion: sanitizarTexto(data.descripcion, LIMITES.DESCRIPCION),
    observaciones: sanitizarTexto(data.observaciones, LIMITES.OBSERVACIONES),
    tipoSiniestro: data.tipoSiniestro || undefined,
    tipoSolicitud: data.tipoSolicitud || undefined
  }
}

/**
 * Valida los datos de un requerimiento
 * @param {Object} data - Datos del requerimiento
 * @returns {string[]} Array de errores (vacío si es válido)
 */
const validarRequerimiento = (data) => {
  const errores = []

  // Validar tipo de requerimiento
  if (!TIPOS_REQUERIMIENTO.includes(data.tipo)) {
    errores.push('Tipo de requerimiento inválido')
  }

  // Validar nombre del cliente
  if (!data.nombreCliente || data.nombreCliente.trim().length < 3) {
    errores.push('El nombre del cliente debe tener al menos 3 caracteres')
  }

  if (data.nombreCliente && data.nombreCliente.length > LIMITES.NOMBRE_CLIENTE) {
    errores.push(`El nombre del cliente no puede exceder ${LIMITES.NOMBRE_CLIENTE} caracteres`)
  }

  // Validar teléfono
  if (!data.telefono) {
    errores.push('El teléfono es requerido')
  } else if (!/^\d{9,15}$/.test(data.telefono)) {
    errores.push('El teléfono debe tener entre 9 y 15 dígitos')
  }

  // Validar email (opcional pero con formato)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errores.push('El email no tiene un formato válido')
  }

  // Validar prioridad
  if (!PRIORIDADES.includes(data.prioridad)) {
    errores.push('Prioridad inválida')
  }

  // Validar descripción
  if (!data.descripcion || data.descripcion.trim().length < 10) {
    errores.push('La descripción debe tener al menos 10 caracteres')
  }

  if (data.descripcion && data.descripcion.length > LIMITES.DESCRIPCION) {
    errores.push(`La descripción no puede exceder ${LIMITES.DESCRIPCION} caracteres`)
  }

  // Validar número de póliza (opcional, solo alfanumérico)
  if (data.numeroPoliza && !/^[A-Z0-9-]+$/i.test(data.numeroPoliza)) {
    errores.push('El número de póliza solo puede contener letras, números y guiones')
  }

  // Validar observaciones (opcional)
  if (data.observaciones && data.observaciones.length > LIMITES.OBSERVACIONES) {
    errores.push(`Las observaciones no pueden exceder ${LIMITES.OBSERVACIONES} caracteres`)
  }

  return errores
}

/**
 * Obtiene todos los requerimientos
 */
const obtenerRequerimientos = async (filtros = {}) => {
  try {
    const response = await requerimientosApi.get('/requerimientos', {
      params: filtros
    })
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener requerimientos:', error)
    throw new Error('Error al cargar los requerimientos')
  }
}

/**
 * Obtiene un requerimiento por ID
 */
const obtenerRequerimientoPorId = async (id) => {
  if (!id || typeof id !== 'string' || id.length > 50) {
    throw new Error('ID inválido')
  }

  try {
    const idSanitizado = id.replace(/[^a-zA-Z0-9-]/g, '')
    const response = await requerimientosApi.get(`/requerimientos/${idSanitizado}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener requerimiento')
    }
    
    return response.data.data
  } catch (error) {
    console.error('❌ Error al obtener requerimiento:', error)
    throw error
  }
}

/**
 * Crea un nuevo requerimiento
 */
const crearRequerimiento = async (data) => {
  // Validar
  const errores = validarRequerimiento(data)
  if (errores.length > 0) {
    throw new Error(`Validación fallida: ${errores.join(', ')}`)
  }

  // Sanitizar
  const datosSanitizados = sanitizarRequerimiento(data)

  try {
    const response = await requerimientosApi.post('/requerimientos', datosSanitizados)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al crear requerimiento')
    }
    
    console.log('✅ Requerimiento creado en el servidor:', response.data.data.id)
    return response.data.data
  } catch (error) {
    console.error('❌ Error al crear requerimiento:', error)
    throw error
  }
}

/**
 * Actualiza un requerimiento existente
 */
const actualizarRequerimiento = async (id, data) => {
  if (!id) {
    throw new Error('ID es requerido para actualizar')
  }

  // Validar
  const errores = validarRequerimiento(data)
  if (errores.length > 0) {
    throw new Error(`Validación fallida: ${errores.join(', ')}`)
  }

  // Sanitizar
  const datosSanitizados = sanitizarRequerimiento(data)

  try {
    const response = await requerimientosApi.put(`/requerimientos/${id}`, datosSanitizados)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al actualizar requerimiento')
    }
    
    console.log('✅ Requerimiento actualizado:', id)
    return response.data.data
  } catch (error) {
    console.error('❌ Error al actualizar requerimiento:', error)
    throw error
  }
}

/**
 * Elimina un requerimiento
 */
const eliminarRequerimiento = async (id) => {
  if (!id) {
    throw new Error('ID es requerido para eliminar')
  }

  try {
    const response = await requerimientosApi.delete(`/requerimientos/${id}`)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar requerimiento')
    }
    
    console.log('✅ Requerimiento eliminado:', id)
  } catch (error) {
    console.error('❌ Error al eliminar requerimiento:', error)
    throw error
  }
}

export const requerimientoService = {
  obtenerRequerimientos,
  obtenerRequerimientoPorId,
  crearRequerimiento,
  actualizarRequerimiento,
  eliminarRequerimiento
}

