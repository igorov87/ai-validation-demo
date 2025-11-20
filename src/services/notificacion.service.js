import notificacionesApi from '@/api/notificaciones'

/**
 * Servicio de Notificaciones por Email
 * Integración con API de Notificaciones de Interseguro
 */

/**
 * Genera el contenido HTML del email con la información del requerimiento
 */
const generarContenidoEmail = (requerimiento) => {
  const prioridadColor = {
    baja: '#6B7280',
    media: '#F59E0B',
    alta: '#F97316',
    urgente: '#EF4444'
  }

  const tipoColor = {
    reclamo: '#EF4444',
    solicitud: '#3B82F6',
    consulta: '#10B981',
    queja: '#F97316',
    sugerencia: '#8B5CF6'
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Requerimiento ${requerimiento.tipo}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Sistema de Requerimientos</h1>
      <p style="margin: 5px 0 0 0; color: #bfdbfe;">Interseguro</p>
    </div>
    
    <!-- Contenido -->
    <div style="padding: 30px;">
      <h2 style="color: #1f2937; margin-top: 0;">Información del Requerimiento</h2>
      
      <!-- Badges -->
      <div style="margin-bottom: 20px;">
        <span style="display: inline-block; background-color: ${tipoColor[requerimiento.tipo]}; color: white; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 8px;">
          ${requerimiento.tipo.toUpperCase()}
        </span>
        <span style="display: inline-block; background-color: ${prioridadColor[requerimiento.prioridad]}; color: white; padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
          PRIORIDAD: ${requerimiento.prioridad.toUpperCase()}
        </span>
      </div>
      
      <!-- Datos del Cliente -->
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">Datos del Cliente</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Cliente:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${requerimiento.nombreCliente}</td>
          </tr>
          ${requerimiento.numeroPoliza ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Póliza:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${requerimiento.numeroPoliza}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Teléfono:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${requerimiento.telefono}</td>
          </tr>
          ${requerimiento.email ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${requerimiento.email}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <!-- Descripción -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 10px;">Descripción</h3>
        <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${requerimiento.descripcion}</p>
      </div>
      
      ${requerimiento.tipoSiniestro ? `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 10px;">Tipo de Siniestro</h3>
        <p style="color: #1f2937; margin: 0;">${requerimiento.tipoSiniestro}</p>
      </div>
      ` : ''}
      
      ${requerimiento.tipoSolicitud ? `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 10px;">Tipo de Solicitud</h3>
        <p style="color: #1f2937; margin: 0;">${requerimiento.tipoSolicitud}</p>
      </div>
      ` : ''}
      
      ${requerimiento.observaciones ? `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 10px;">Observaciones</h3>
        <p style="color: #6b7280; line-height: 1.6; margin: 0; white-space: pre-wrap;">${requerimiento.observaciones}</p>
      </div>
      ` : ''}
      
      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Fecha de registro: ${requerimiento.fechaRegistro || new Date().toLocaleString('es-ES')}
        </p>
        ${requerimiento.id ? `
        <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
          ID: ${requerimiento.id}
        </p>
        ` : ''}
      </div>
    </div>
    
    <!-- Footer del Email -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        Este es un correo automático generado por el Sistema de Requerimientos de Interseguro.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Envía un email con la información del requerimiento
 * @param {Object} requerimiento - Datos del requerimiento
 * @param {string} destinatario - Email del destinatario
 * @returns {Promise<Object>} Respuesta del API
 */
const enviarEmailRequerimiento = async (requerimiento, destinatario) => {
  if (!destinatario || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario)) {
    throw new Error('Email del destinatario inválido')
  }

  if (!requerimiento) {
    throw new Error('Datos del requerimiento son requeridos')
  }

  const emailData = {
    title: `Requerimiento ${requerimiento.tipo} - ${requerimiento.nombreCliente}`,
    subject: `Requerimiento ${requerimiento.tipo.toUpperCase()} - ${requerimiento.nombreCliente}`,
    htmlContent: generarContenidoEmail(requerimiento),
    priority: requerimiento.prioridad === 'urgente' || requerimiento.prioridad === 'alta' ? 'high' : 'normal',
    from: {
      name: 'Sistema de Requerimientos - Interseguro',
      email: 'noreply@interseguro.com.pe'
    },
    to: [
      {
        email: destinatario
      }
    ]
  }

  try {
    console.log('📧 Enviando email a:', destinatario)
    const response = await notificacionesApi.post('/v1/notify/email', emailData)
    
    console.log('✅ Email enviado exitosamente. ID:', response.data.idCreated)
    
    return {
      success: true,
      message: 'Email enviado correctamente',
      idCreated: response.data.idCreated
    }
  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    
    const errorMessage = error.response?.data?.message || 'Error al enviar el correo electrónico'
    
    throw new Error(errorMessage)
  }
}

/**
 * Obtiene el estado de un email enviado
 * @param {string} emailId - ID del email
 * @returns {Promise<Object>} Estado del email
 */
const obtenerEstadoEmail = async (emailId) => {
  if (!emailId) {
    throw new Error('ID del email es requerido')
  }

  try {
    const response = await notificacionesApi.get(`/v1/notify/email/${emailId}/status`)
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener estado del email:', error)
    throw new Error('Error al consultar el estado del email')
  }
}

export const notificacionService = {
  enviarEmailRequerimiento,
  obtenerEstadoEmail,
  generarContenidoEmail
}

