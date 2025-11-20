import { ref } from 'vue'
import { requerimientoService } from '@/services/requerimiento.service'
import { correoService } from '@/services/correo.service'

/**
 * Composable para gestionar requerimientos
 * Encapsula toda la lógica reactiva y comunicación con servicios
 */
export const useRequerimiento = () => {
  const requerimientos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const notificacion = ref(null)

  /**
   * Muestra una notificación temporal
   */
  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    notificacion.value = { mensaje, tipo }
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      notificacion.value = null
    }, 3000)
  }

  /**
   * Lista todos los requerimientos
   */
  const listarRequerimientos = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await requerimientoService.obtenerRequerimientos()
      requerimientos.value = response.data || []
      console.log(`✅ ${requerimientos.value.length} requerimientos cargados`)
    } catch (err) {
      error.value = err.message || 'Error al cargar requerimientos'
      console.error('❌ Error al listar requerimientos:', err)
      mostrarNotificacion(error.value, 'error')
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un requerimiento por su ID
   */
  const obtenerRequerimiento = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const requerimiento = await requerimientoService.obtenerRequerimientoPorId(id)
      console.log('✅ Requerimiento obtenido:', requerimiento.id)
      return requerimiento
    } catch (err) {
      error.value = err.message || 'Error al obtener requerimiento'
      console.error('❌ Error al obtener requerimiento:', err)
      mostrarNotificacion(error.value, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Crea un nuevo requerimiento
   */
  const crearRequerimiento = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      // Validación básica antes de enviar
      if (!data.nombreCliente || !data.telefono || !data.descripcion) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      const nuevoRequerimiento = await requerimientoService.crearRequerimiento(data)
      
      // Agregar a la lista local
      requerimientos.value.unshift(nuevoRequerimiento)
      
      console.log('✅ Requerimiento creado exitosamente')
      mostrarNotificacion('Requerimiento creado exitosamente', 'success')
      
      return nuevoRequerimiento
    } catch (err) {
      error.value = err.message || 'Error al crear requerimiento'
      console.error('❌ Error al crear requerimiento:', err)
      mostrarNotificacion(error.value, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza un requerimiento existente
   */
  const actualizarRequerimiento = async (id, data) => {
    loading.value = true
    error.value = null
    
    try {
      // Validación básica antes de enviar
      if (!data.nombreCliente || !data.telefono || !data.descripcion) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      const requerimientoActualizado = await requerimientoService.actualizarRequerimiento(id, data)
      
      // Actualizar en la lista local
      const index = requerimientos.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requerimientos.value[index] = requerimientoActualizado
      }
      
      console.log('✅ Requerimiento actualizado exitosamente')
      mostrarNotificacion('Requerimiento actualizado exitosamente', 'success')
      
      return requerimientoActualizado
    } catch (err) {
      error.value = err.message || 'Error al actualizar requerimiento'
      console.error('❌ Error al actualizar requerimiento:', err)
      mostrarNotificacion(error.value, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Elimina un requerimiento
   */
  const eliminarRequerimiento = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await requerimientoService.eliminarRequerimiento(id)
      
      // Eliminar de la lista local
      requerimientos.value = requerimientos.value.filter(req => req.id !== id)
      
      console.log('✅ Requerimiento eliminado')
      mostrarNotificacion('Requerimiento eliminado exitosamente', 'success')
      
      return true
    } catch (err) {
      error.value = err.message || 'Error al eliminar requerimiento'
      console.error('❌ Error al eliminar requerimiento:', err)
      mostrarNotificacion(error.value, 'error')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Envía un requerimiento por correo electrónico
   */
  const enviarPorCorreo = async (requerimiento, emailDestino = null) => {
    loading.value = true
    error.value = null
    
    try {
      // Validar que haya un email
      const email = emailDestino || requerimiento.email
      
      if (!email) {
        throw new Error('El requerimiento no tiene un email asociado')
      }

      const response = await correoService.enviarRequerimientoPorCorreo(requerimiento, emailDestino)
      
      console.log('✅ Correo enviado exitosamente')
      mostrarNotificacion(`Correo enviado exitosamente a ${email}`, 'success')
      
      return response
    } catch (err) {
      error.value = err.message || 'Error al enviar correo'
      console.error('❌ Error al enviar correo:', err)
      mostrarNotificacion(error.value, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    requerimientos,
    loading,
    error,
    notificacion,
    
    // Métodos
    listarRequerimientos,
    obtenerRequerimiento,
    crearRequerimiento,
    actualizarRequerimiento,
    eliminarRequerimiento,
    enviarPorCorreo
  }
}

