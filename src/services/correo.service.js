import correoApi from '@/api/correo'

/**
 * Servicio de Correo
 * Contiene la lógica para envío de correos electrónicos
 */

/**
 * Valida un email
 */
const validarEmail = (email) => {
  if (!email) {
    throw new Error('El email es requerido')
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('El email no tiene un formato válido')
  }
}

/**
 * Envía un requerimiento por correo electrónico
 * 
 * @param {Object} requerimiento - Datos del requerimiento a enviar
 * @param {string} emailDestino - Email del destinatario (opcional, si no se proporciona usa el del requerimiento)
 * @returns {Promise<Object>} Respuesta del servidor
 */
const enviarRequerimientoPorCorreo = async (requerimiento, emailDestino = null) => {
  // Validar requerimiento
  if (!requerimiento) {
    throw new Error('El requerimiento es requerido')
  }

  if (!requerimiento.id) {
    throw new Error('El requerimiento debe tener un ID')
  }

  // Determinar email destino
  const email = emailDestino || requerimiento.email

  // Validar email
  validarEmail(email)

  // Preparar datos para envío
  const datosCorreo = {
    destinatario: email,
    asunto: `Requerimiento #${requerimiento.id} - ${getTipoLabel(requerimiento.tipo)}`,
    requerimientoId: requerimiento.id,
    contenido: {
      tipo: requerimiento.tipo,
      nombreCliente: requerimiento.nombreCliente,
      numeroPoliza: requerimiento.numeroPoliza,
      telefono: requerimiento.telefono,
      email: requerimiento.email,
      prioridad: requerimiento.prioridad,
      descripcion: requerimiento.descripcion,
      observaciones: requerimiento.observaciones,
      tipoSiniestro: requerimiento.tipoSiniestro,
      tipoSolicitud: requerimiento.tipoSolicitud,
      fechaRegistro: requerimiento.fechaRegistro
    }
  }

  try {
    const response = await correoApi.post('/enviar', datosCorreo)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al enviar correo')
    }

    console.log('✅ Correo enviado exitosamente a:', email)
    return response.data
  } catch (error) {
    // Si la API no está disponible, simular éxito en desarrollo
    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      console.warn('⚠️ API de correo no disponible. Simulando envío en desarrollo.')
      return {
        success: true,
        message: 'Correo enviado (simulado en desarrollo)',
        destinatario: email
      }
    }
    
    throw error
  }
}

/**
 * Obtiene la etiqueta legible del tipo de requerimiento
 */
const getTipoLabel = (tipo) => {
  const labels = {
    reclamo: 'Reclamo',
    solicitud: 'Solicitud',
    consulta: 'Consulta',
    queja: 'Queja',
    sugerencia: 'Sugerencia'
  }
  return labels[tipo] || tipo
}

export const correoService = {
  enviarRequerimientoPorCorreo,
  validarEmail
}

