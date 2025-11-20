import correoApi from '@/api/correo'
import config from '@/config'

/**
 * Servicio de Correo
 * Integración con API de Notificaciones de Interseguro
 * Documentación: Confluence - Gobierno de APIs (ID: 169476564)
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
 * Genera el contenido HTML del correo con los datos del requerimiento
 */
const generarHtmlCorreo = (requerimiento) => {
  const fechaFormateada = requerimiento.fechaRegistro 
    ? new Date(requerimiento.fechaRegistro).toLocaleString('es-PE') 
    : 'No especificada'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #0066cc; }
        .field-value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .priority-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .priority-baja { background-color: #e3f2fd; color: #1976d2; }
        .priority-media { background-color: #fff3e0; color: #f57c00; }
        .priority-alta { background-color: #ffebee; color: #c62828; }
        .priority-urgente { background-color: #f44336; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Requerimiento #${requerimiento.id}</h1>
          <p>${getTipoLabel(requerimiento.tipo)}</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="field-label">Prioridad:</div>
            <div class="field-value">
              <span class="priority-badge priority-${requerimiento.prioridad}">
                ${getPrioridadLabel(requerimiento.prioridad).toUpperCase()}
              </span>
            </div>
          </div>

          <div class="field">
            <div class="field-label">Cliente:</div>
            <div class="field-value">${requerimiento.nombreCliente}</div>
          </div>

          ${requerimiento.numeroPoliza ? `
          <div class="field">
            <div class="field-label">Número de Póliza:</div>
            <div class="field-value">${requerimiento.numeroPoliza}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">Teléfono:</div>
            <div class="field-value">${requerimiento.telefono}</div>
          </div>

          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${requerimiento.email}</div>
          </div>

          ${requerimiento.tipoSiniestro ? `
          <div class="field">
            <div class="field-label">Tipo de Siniestro:</div>
            <div class="field-value">${getTipoSiniestroLabel(requerimiento.tipoSiniestro)}</div>
          </div>
          ` : ''}

          ${requerimiento.tipoSolicitud ? `
          <div class="field">
            <div class="field-label">Tipo de Solicitud:</div>
            <div class="field-value">${getTipoSolicitudLabel(requerimiento.tipoSolicitud)}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">Descripción:</div>
            <div class="field-value">${requerimiento.descripcion}</div>
          </div>

          ${requerimiento.observaciones ? `
          <div class="field">
            <div class="field-label">Observaciones:</div>
            <div class="field-value">${requerimiento.observaciones}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">Fecha de Registro:</div>
            <div class="field-value">${fechaFormateada}</div>
          </div>
        </div>

        <div class="footer">
          <p>Este correo fue generado automáticamente por el Sistema de Requerimientos de Interseguro.</p>
          <p>Por favor, no responda a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Mapea la prioridad del requerimiento al formato de la API de Notificaciones
 */
const mapearPrioridad = (prioridad) => {
  const mapeo = {
    baja: 'low',
    media: 'normal',
    alta: 'high',
    urgente: 'high'
  }
  return mapeo[prioridad] || 'normal'
}

/**
 * Envía un requerimiento por correo electrónico usando la API de Notificaciones de Interseguro
 * Endpoint: POST /v1/notify/email
 * 
 * @param {Object} requerimiento - Datos del requerimiento a enviar
 * @param {string} emailDestino - Email del destinatario (opcional, si no se proporciona usa el del requerimiento)
 * @returns {Promise<Object>} Respuesta del servidor con { status, message, idCreated }
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

  // Preparar datos según el formato de la API de Notificaciones de Interseguro
  // Ver documentación: Confluence - Gobierno de APIs (ID: 169476564)
  const emailPayload = {
    title: `Requerimiento #${requerimiento.id}`,
    subject: `Requerimiento #${requerimiento.id} - ${getTipoLabel(requerimiento.tipo)} - ${requerimiento.nombreCliente}`,
    htmlContent: generarHtmlCorreo(requerimiento),
    priority: mapearPrioridad(requerimiento.prioridad),
    from: {
      name: config.CORREO_FROM_NAME,
      email: config.CORREO_FROM_EMAIL
    },
    to: [
      {
        email: email
      }
    ]
  }

  try {
    // Endpoint de la API de Notificaciones: POST /v1/notify/email
    const response = await correoApi.post('/v1/notify/email', emailPayload)
    
    // La API responde con código 201 y estructura: { status, message, idCreated }
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Error al enviar correo')
    }

    console.log('✅ Correo enviado exitosamente a:', email)
    console.log('📧 ID del correo creado:', response.data.idCreated)
    
    return {
      success: true,
      message: response.data.message || 'Correo enviado exitosamente',
      emailId: response.data.idCreated,
      destinatario: email
    }
  } catch (error) {
    // Si la API no está disponible, simular éxito en desarrollo
    if (import.meta.env.DEV && (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED')) {
      console.warn('⚠️ API de notificaciones no disponible. Simulando envío en desarrollo.')
      return {
        success: true,
        message: 'Correo enviado (simulado en desarrollo)',
        emailId: 'dev-' + Date.now(),
        destinatario: email
      }
    }
    
    console.error('❌ Error al enviar correo:', error)
    throw new Error(error.response?.data?.message || error.message || 'Error al enviar correo')
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

/**
 * Obtiene la etiqueta legible de prioridad
 */
const getPrioridadLabel = (prioridad) => {
  const labels = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    urgente: 'Urgente'
  }
  return labels[prioridad] || prioridad
}

/**
 * Obtiene la etiqueta legible del tipo de siniestro
 */
const getTipoSiniestroLabel = (tipo) => {
  const labels = {
    accidente: 'Accidente',
    robo: 'Robo',
    incendio: 'Incendio',
    danos: 'Daños',
    otro: 'Otro'
  }
  return labels[tipo] || tipo
}

/**
 * Obtiene la etiqueta legible del tipo de solicitud
 */
const getTipoSolicitudLabel = (tipo) => {
  const labels = {
    endoso: 'Endoso',
    cancelacion: 'Cancelación',
    renovacion: 'Renovación',
    modificacion: 'Modificación',
    otro: 'Otro'
  }
  return labels[tipo] || tipo
}

export const correoService = {
  enviarRequerimientoPorCorreo,
  validarEmail
}

