import requerimientosApi from '@/api/requerimientos'

/**
 * Servicio de Requerimientos
 * Contiene toda la lógica de negocio relacionada con requerimientos
 */

// Constantes con valores permitidos (lista blanca)
const TIPOS_REQUERIMIENTO = ['reclamo', 'solicitud', 'consulta', 'queja', 'sugerencia']
const PRIORIDADES = ['baja', 'media', 'alta', 'urgente']
const TIPOS_SINIESTRO = ['accidente', 'robo', 'incendio', 'daños', 'otro']
const TIPOS_SOLICITUD = ['cobertura', 'cancelacion', 'renovacion', 'endoso', 'otro']

// Límites de longitud
const LIMITES = {
  NOMBRE_CLIENTE: 100,
  NUMERO_POLIZA: 50,
  TELEFONO: 15,
  EMAIL: 100,
  DESCRIPCION: 5000,
  OBSERVACIONES: 2000
}

/**
 * Utilidades para sanitizar datos de entrada
 */
const sanitizarTexto = (texto, maxLength = 1000) => {
  if (!texto) return ''
  
  let sanitizado = texto.trim()
  sanitizado = sanitizado.substring(0, maxLength)
  
  // Escapar caracteres especiales HTML
  sanitizado = sanitizado
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
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
 * Valida los datos de un requerimiento
 * @param {Object} data - Datos del requerimiento
 * @returns {string[]} Array de errores (vacío si es válido)
 */
const validarRequerimiento = (data) => {
  const errores = []

  // Validar nombre del cliente
  if (!data.nombreCliente || data.nombreCliente.trim().length < 3) {
    errores.push('El nombre del cliente debe tener al menos 3 caracteres')
  }

  if (data.nombreCliente && data.nombreCliente.length > LIMITES.NOMBRE_CLIENTE) {
    errores.push(`El nombre no puede exceder ${LIMITES.NOMBRE_CLIENTE} caracteres`)
  }

  // Validar teléfono
  if (!data.telefono) {
    errores.push('El teléfono es requerido')
  } else if (!/^\d{9,15}$/.test(data.telefono.replace(/\D/g, ''))) {
    errores.push('El teléfono debe tener entre 9 y 15 dígitos')
  }

  // Validar email (opcional pero con formato)
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errores.push('El email no tiene un formato válido')
  }

  if (data.email && data.email.length > LIMITES.EMAIL) {
    errores.push(`El email no puede exceder ${LIMITES.EMAIL} caracteres`)
  }

  // Validar tipo de requerimiento
  if (!TIPOS_REQUERIMIENTO.includes(data.tipo)) {
    errores.push(`Tipo de requerimiento inválido. Valores permitidos: ${TIPOS_REQUERIMIENTO.join(', ')}`)
  }

  // Validar prioridad
  if (!PRIORIDADES.includes(data.prioridad)) {
    errores.push(`Prioridad inválida. Valores permitidos: ${PRIORIDADES.join(', ')}`)
  }

  // Validar tipo de siniestro (si aplica)
  if (data.tipo === 'reclamo' && data.tipoSiniestro && !TIPOS_SINIESTRO.includes(data.tipoSiniestro)) {
    errores.push(`Tipo de siniestro inválido. Valores permitidos: ${TIPOS_SINIESTRO.join(', ')}`)
  }

  // Validar tipo de solicitud (si aplica)
  if (data.tipo === 'solicitud' && data.tipoSolicitud && !TIPOS_SOLICITUD.includes(data.tipoSolicitud)) {
    errores.push(`Tipo de solicitud inválido. Valores permitidos: ${TIPOS_SOLICITUD.join(', ')}`)
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

  if (data.numeroPoliza && data.numeroPoliza.length > LIMITES.NUMERO_POLIZA) {
    errores.push(`El número de póliza no puede exceder ${LIMITES.NUMERO_POLIZA} caracteres`)
  }

  // Validar observaciones (opcional)
  if (data.observaciones && data.observaciones.length > LIMITES.OBSERVACIONES) {
    errores.push(`Las observaciones no pueden exceder ${LIMITES.OBSERVACIONES} caracteres`)
  }

  return errores
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
 * Obtiene todos los requerimientos con filtros opcionales
 */
const obtenerRequerimientos = async (filtros = {}) => {
  const response = await requerimientosApi.get('/requerimientos', {
    params: filtros
  })
  return response.data
}

/**
 * Obtiene un requerimiento por su ID
 */
const obtenerRequerimientoPorId = async (id) => {
  // Validar que el ID sea seguro
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    throw new Error('ID inválido')
  }

  // Sanitizar ID
  const idSanitizado = String(id).replace(/[^a-zA-Z0-9-]/g, '')

  const response = await requerimientosApi.get(`/requerimientos/${idSanitizado}`)
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Error al obtener requerimiento')
  }
  
  return response.data.data
}

/**
 * Crea un nuevo requerimiento
 */
const crearRequerimiento = async (data) => {
  // Sanitizar datos primero
  const datosSanitizados = sanitizarRequerimiento(data)

  // Validar datos sanitizados
  const errores = validarRequerimiento(datosSanitizados)
  if (errores.length > 0) {
    throw new Error(`Validación fallida: ${errores.join(', ')}`)
  }

  // Enviar a API
  const response = await requerimientosApi.post('/requerimientos', datosSanitizados)
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Error al crear requerimiento')
  }

  console.log('✅ Requerimiento creado en el servidor:', response.data.data.id)
  return response.data.data
}

/**
 * Actualiza un requerimiento existente
 */
const actualizarRequerimiento = async (id, data) => {
  // Validar ID
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    throw new Error('ID inválido')
  }

  // Sanitizar datos primero
  const datosSanitizados = sanitizarRequerimiento(data)

  // Validar datos sanitizados
  const errores = validarRequerimiento(datosSanitizados)
  if (errores.length > 0) {
    throw new Error(`Validación fallida: ${errores.join(', ')}`)
  }

  // Sanitizar ID
  const idSanitizado = String(id).replace(/[^a-zA-Z0-9-]/g, '')

  // Enviar a API
  const response = await requerimientosApi.put(`/requerimientos/${idSanitizado}`, datosSanitizados)
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Error al actualizar requerimiento')
  }

  console.log('✅ Requerimiento actualizado:', response.data.data.id)
  return response.data.data
}

/**
 * Elimina un requerimiento
 */
const eliminarRequerimiento = async (id) => {
  // Validar ID
  if (!id || typeof id !== 'string' && typeof id !== 'number') {
    throw new Error('ID inválido')
  }

  // Sanitizar ID
  const idSanitizado = String(id).replace(/[^a-zA-Z0-9-]/g, '')

  const response = await requerimientosApi.delete(`/requerimientos/${idSanitizado}`)
  
  if (!response.data.success) {
    throw new Error(response.data.message || 'Error al eliminar requerimiento')
  }

  console.log('✅ Requerimiento eliminado:', idSanitizado)
}

export const requerimientoService = {
  obtenerRequerimientos,
  obtenerRequerimientoPorId,
  crearRequerimiento,
  actualizarRequerimiento,
  eliminarRequerimiento
}

