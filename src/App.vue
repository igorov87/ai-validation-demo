<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-blue-900 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold">Sistema de Registro de Requerimientos</h1>
        <p class="text-blue-200 mt-2">Interseguro</p>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <button
          @click="abrirFormularioNuevo"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
          :disabled="loading"
        >
          + Nuevo Requerimiento
        </button>
      </div>

      <!-- Indicador de carga global -->
      <div v-if="loading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Procesando...</p>
      </div>

      <!-- Formulario de registro/edición -->
      <RegistroRequerimiento 
        v-if="showForm"
        :requerimientoEditar="requerimientoEditar"
        @cerrar="cerrarFormulario"
        @guardar="agregarRequerimiento"
        @actualizar="actualizarRequerimiento"
      />

      <!-- Lista de requerimientos -->
      <ListaRequerimientos 
        :requerimientos="requerimientos"
        @eliminar="eliminarRequerimiento"
        @editar="abrirFormularioEdicion"
        @enviarCorreo="enviarRequerimientoPorCorreo"
      />

      <!-- Notificaciones Toast -->
      <ToastNotification 
        :notificacion="notificacion"
        @cerrar="notificacion = null"
      />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRequerimiento } from './composables/useRequerimiento'
import RegistroRequerimiento from './components/RegistroRequerimiento.vue'
import ListaRequerimientos from './components/ListaRequerimientos.vue'
import ToastNotification from './components/ToastNotification.vue'

export default {
  name: 'App',
  components: {
    RegistroRequerimiento,
    ListaRequerimientos,
    ToastNotification
  },
  setup() {
    const showForm = ref(false)
    const requerimientoEditar = ref(null)

    // Usar el composable con toda la lógica
    const {
      requerimientos,
      loading,
      error,
      notificacion,
      listarRequerimientos,
      crearRequerimiento,
      actualizarRequerimiento: actualizarRequerimientoService,
      eliminarRequerimiento: eliminarRequerimientoService,
      enviarPorCorreo
    } = useRequerimiento()

    // Cargar requerimientos al iniciar (opcional, comentado porque usamos datos locales)
    // onMounted(async () => {
    //   await listarRequerimientos()
    // })

    // Inicializar con datos de ejemplo en localStorage
    onMounted(() => {
      const datosGuardados = localStorage.getItem('requerimientos')
      if (datosGuardados) {
        requerimientos.value = JSON.parse(datosGuardados)
      }
    })

    /**
     * Abre el formulario para crear un nuevo requerimiento
     */
    const abrirFormularioNuevo = () => {
      requerimientoEditar.value = null
      showForm.value = true
    }

    /**
     * Abre el formulario para editar un requerimiento existente
     */
    const abrirFormularioEdicion = (requerimiento) => {
      requerimientoEditar.value = requerimiento
      showForm.value = true
    }

    /**
     * Cierra el formulario
     */
    const cerrarFormulario = () => {
      showForm.value = false
      requerimientoEditar.value = null
    }

    /**
     * Agrega un nuevo requerimiento
     */
    const agregarRequerimiento = async (data) => {
      // En un entorno real, llamaríamos al servicio
      // const resultado = await crearRequerimiento(data)
      
      // Por ahora, agregamos localmente
      const nuevoRequerimiento = {
        id: Date.now(),
        ...data,
        fechaRegistro: new Date().toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      requerimientos.value.unshift(nuevoRequerimiento)
      
      // Guardar en localStorage
      localStorage.setItem('requerimientos', JSON.stringify(requerimientos.value))
      
      notificacion.value = {
        mensaje: 'Requerimiento creado exitosamente',
        tipo: 'success'
      }
      
      cerrarFormulario()
      
      // Auto-ocultar notificación
      setTimeout(() => {
        notificacion.value = null
      }, 3000)
    }

    /**
     * Actualiza un requerimiento existente
     */
    const actualizarRequerimiento = async (id, data) => {
      // En un entorno real, llamaríamos al servicio
      // const resultado = await actualizarRequerimientoService(id, data)
      
      // Por ahora, actualizamos localmente
      const index = requerimientos.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requerimientos.value[index] = {
          ...requerimientos.value[index],
          ...data
        }
        
        // Guardar en localStorage
        localStorage.setItem('requerimientos', JSON.stringify(requerimientos.value))
        
        notificacion.value = {
          mensaje: 'Requerimiento actualizado exitosamente',
          tipo: 'success'
        }
        
        cerrarFormulario()
        
        // Auto-ocultar notificación
        setTimeout(() => {
          notificacion.value = null
        }, 3000)
      }
    }

    /**
     * Elimina un requerimiento
     */
    const eliminarRequerimiento = async (id) => {
      // En un entorno real, llamaríamos al servicio
      // const resultado = await eliminarRequerimientoService(id)
      
      // Por ahora, eliminamos localmente
      requerimientos.value = requerimientos.value.filter(req => req.id !== id)
      
      // Guardar en localStorage
      localStorage.setItem('requerimientos', JSON.stringify(requerimientos.value))
      
      notificacion.value = {
        mensaje: 'Requerimiento eliminado exitosamente',
        tipo: 'success'
      }
      
      // Auto-ocultar notificación
      setTimeout(() => {
        notificacion.value = null
      }, 3000)
    }

    /**
     * Envía un requerimiento por correo usando la API de Notificaciones de Interseguro
     */
    const enviarRequerimientoPorCorreo = async (requerimiento) => {
      try {
        // Llamar al servicio real de correo
        const resultado = await enviarPorCorreo(requerimiento)
        
        if (resultado) {
          console.log('✅ Correo enviado con ID:', resultado.emailId)
        }
      } catch (err) {
        console.error('❌ Error al enviar correo:', err)
      }
      
      // La notificación ya se maneja en el composable
      // No necesitamos manejarla aquí
    }

    return {
      showForm,
      requerimientoEditar,
      requerimientos,
      loading,
      error,
      notificacion,
      abrirFormularioNuevo,
      abrirFormularioEdicion,
      cerrarFormulario,
      agregarRequerimiento,
      actualizarRequerimiento,
      eliminarRequerimiento,
      enviarRequerimientoPorCorreo
    }
  }
}
</script>

