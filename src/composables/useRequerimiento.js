import { ref } from 'vue'
import { requerimientoService } from '@/services/requerimiento.service'

/**
 * Composable para manejo de requerimientos
 * Proporciona estado reactivo y métodos para CRUD de requerimientos
 */
export const useRequerimiento = () => {
  const requerimientos = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Lista todos los requerimientos
   */
  const listarRequerimientos = async (filtros = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await requerimientoService.obtenerRequerimientos(filtros)
      requerimientos.value = response.data || []
      console.log(`✅ ${requerimientos.value.length} requerimientos cargados`)
    } catch (err) {
      error.value = err.message || 'Error al cargar requerimientos'
      console.error('❌ Error al listar requerimientos:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un requerimiento por ID
   */
  const obtenerRequerimiento = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const requerimiento = await requerimientoService.obtenerRequerimientoPorId(id)
      console.log('✅ Requerimiento obtenido:', id)
      return requerimiento
    } catch (err) {
      error.value = err.message || 'Error al obtener requerimiento'
      console.error('❌ Error al obtener requerimiento:', err)
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
      const nuevoRequerimiento = await requerimientoService.crearRequerimiento(data)
      requerimientos.value.unshift(nuevoRequerimiento)
      console.log('✅ Requerimiento creado exitosamente')
      return nuevoRequerimiento
    } catch (err) {
      error.value = err.message || 'Error al crear requerimiento'
      console.error('❌ Error al crear requerimiento:', err)
      throw err
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
      const requerimientoActualizado = await requerimientoService.actualizarRequerimiento(id, data)
      
      // Actualizar en el listado local
      const index = requerimientos.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requerimientos.value[index] = requerimientoActualizado
      }
      
      console.log('✅ Requerimiento actualizado exitosamente')
      return requerimientoActualizado
    } catch (err) {
      error.value = err.message || 'Error al actualizar requerimiento'
      console.error('❌ Error al actualizar requerimiento:', err)
      throw err
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
      requerimientos.value = requerimientos.value.filter(req => req.id !== id)
      console.log('✅ Requerimiento eliminado')
      return true
    } catch (err) {
      error.value = err.message || 'Error al eliminar requerimiento'
      console.error('❌ Error al eliminar requerimiento:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    requerimientos,
    loading,
    error,
    
    // Métodos
    listarRequerimientos,
    obtenerRequerimiento,
    crearRequerimiento,
    actualizarRequerimiento,
    eliminarRequerimiento
  }
}

