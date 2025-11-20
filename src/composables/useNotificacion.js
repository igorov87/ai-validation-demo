import { ref } from 'vue'

/**
 * Composable para manejo de notificaciones toast
 * Proporciona un sistema de notificaciones temporales en la UI
 */
export const useNotificacion = () => {
  const notificaciones = ref([])
  let contadorId = 0

  /**
   * Tipos de notificaciones
   */
  const TIPOS = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }

  /**
   * Agrega una notificación
   * @param {string} mensaje - Mensaje a mostrar
   * @param {string} tipo - Tipo de notificación (success, error, warning, info)
   * @param {number} duracion - Duración en milisegundos (0 para permanente)
   */
  const agregar = (mensaje, tipo = TIPOS.SUCCESS, duracion = 5000) => {
    const id = ++contadorId
    
    const notificacion = {
      id,
      mensaje,
      tipo,
      visible: true
    }

    notificaciones.value.push(notificacion)

    // Auto-remover después de la duración especificada
    if (duracion > 0) {
      setTimeout(() => {
        remover(id)
      }, duracion)
    }

    return id
  }

  /**
   * Remueve una notificación por ID
   */
  const remover = (id) => {
    const index = notificaciones.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notificaciones.value.splice(index, 1)
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  const limpiar = () => {
    notificaciones.value = []
  }

  /**
   * Métodos de atajo para cada tipo
   */
  const exito = (mensaje, duracion = 5000) => {
    return agregar(mensaje, TIPOS.SUCCESS, duracion)
  }

  const error = (mensaje, duracion = 7000) => {
    return agregar(mensaje, TIPOS.ERROR, duracion)
  }

  const advertencia = (mensaje, duracion = 6000) => {
    return agregar(mensaje, TIPOS.WARNING, duracion)
  }

  const info = (mensaje, duracion = 5000) => {
    return agregar(mensaje, TIPOS.INFO, duracion)
  }

  return {
    // Estado
    notificaciones,
    TIPOS,
    
    // Métodos
    agregar,
    remover,
    limpiar,
    exito,
    error,
    advertencia,
    info
  }
}

