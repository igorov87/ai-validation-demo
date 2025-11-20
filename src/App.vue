<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-blue-900 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold">Sistema de Registro de Requerimientos</h1>
        <p class="text-blue-200 mt-2">Empresa de Seguros</p>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <button
          @click="abrirFormularioNuevo"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
        >
          + Nuevo Requerimiento
        </button>
      </div>

      <RegistroRequerimiento 
        v-if="showForm"
        :requerimiento-editar="requerimientoEditar"
        @cerrar="cerrarFormulario"
        @guardar="agregarRequerimiento"
        @actualizar="actualizarRequerimiento"
      />

      <ListaRequerimientos 
        :requerimientos="requerimientos"
        @eliminar="eliminarRequerimiento"
        @editar="abrirFormularioEditar"
        @enviar-correo="solicitarCorreoYEnviar"
      />
    </main>

    <!-- Componente de Notificaciones Toast -->
    <NotificacionToast 
      :notificaciones="notificaciones"
      @cerrar="cerrarNotificacion"
    />

    <!-- Modal para solicitar correo -->
    <div 
      v-if="mostrarModalCorreo"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Enviar Requerimiento por Correo</h3>
        <p class="text-gray-600 mb-4">Ingrese la dirección de correo del destinatario:</p>
        
        <input
          v-model="correoDestinatario"
          type="email"
          placeholder="ejemplo@correo.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          @keyup.enter="confirmarEnvioCorreo"
        />
        
        <div class="flex justify-end gap-3">
          <button
            @click="cancelarEnvioCorreo"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Cancelar
          </button>
          <button
            @click="confirmarEnvioCorreo"
            :disabled="!correoDestinatario || enviandoCorreo"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ enviandoCorreo ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import RegistroRequerimiento from './components/RegistroRequerimiento.vue'
import ListaRequerimientos from './components/ListaRequerimientos.vue'
import NotificacionToast from './components/NotificacionToast.vue'
import { useNotificacion } from './composables/useNotificacion'
import { notificacionService } from './services/notificacion.service'

export default {
  name: 'App',
  components: {
    RegistroRequerimiento,
    ListaRequerimientos,
    NotificacionToast
  },
  setup() {
    const showForm = ref(false)
    const requerimientos = ref([])
    const requerimientoEditar = ref(null)
    const mostrarModalCorreo = ref(false)
    const correoDestinatario = ref('')
    const requerimientoParaEnviar = ref(null)
    const enviandoCorreo = ref(false)

    // Composable de notificaciones
    const { notificaciones, exito, error: mostrarError, remover } = useNotificacion()

    const abrirFormularioNuevo = () => {
      requerimientoEditar.value = null
      showForm.value = true
    }

    const abrirFormularioEditar = (requerimiento) => {
      requerimientoEditar.value = requerimiento
      showForm.value = true
    }

    const cerrarFormulario = () => {
      showForm.value = false
      requerimientoEditar.value = null
    }

    const agregarRequerimiento = (requerimiento) => {
      requerimientos.value.unshift({
        id: Date.now(),
        ...requerimiento,
        fechaRegistro: new Date().toLocaleString('es-ES')
      })
      showForm.value = false
      exito('Requerimiento creado exitosamente')
    }

    const actualizarRequerimiento = (id, datosActualizados) => {
      const index = requerimientos.value.findIndex(req => req.id === id)
      if (index !== -1) {
        requerimientos.value[index] = {
          ...requerimientos.value[index],
          ...datosActualizados
        }
        showForm.value = false
        requerimientoEditar.value = null
        exito('Requerimiento actualizado exitosamente')
      }
    }

    const eliminarRequerimiento = (id) => {
      requerimientos.value = requerimientos.value.filter(req => req.id !== id)
      exito('Requerimiento eliminado')
    }

    const solicitarCorreoYEnviar = (requerimiento) => {
      requerimientoParaEnviar.value = requerimiento
      correoDestinatario.value = requerimiento.email || ''
      mostrarModalCorreo.value = true
    }

    const cancelarEnvioCorreo = () => {
      mostrarModalCorreo.value = false
      correoDestinatario.value = ''
      requerimientoParaEnviar.value = null
    }

    const confirmarEnvioCorreo = async () => {
      if (!correoDestinatario.value) {
        mostrarError('Por favor ingrese un correo válido')
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(correoDestinatario.value)) {
        mostrarError('El formato del correo no es válido')
        return
      }

      enviandoCorreo.value = true

      try {
        await notificacionService.enviarEmailRequerimiento(
          requerimientoParaEnviar.value,
          correoDestinatario.value
        )
        
        exito(`Correo enviado exitosamente a ${correoDestinatario.value}`)
        cancelarEnvioCorreo()
      } catch (err) {
        console.error('Error al enviar correo:', err)
        mostrarError(err.message || 'Error al enviar el correo electrónico')
      } finally {
        enviandoCorreo.value = false
      }
    }

    const cerrarNotificacion = (id) => {
      remover(id)
    }

    return {
      showForm,
      requerimientos,
      requerimientoEditar,
      mostrarModalCorreo,
      correoDestinatario,
      enviandoCorreo,
      notificaciones,
      abrirFormularioNuevo,
      abrirFormularioEditar,
      cerrarFormulario,
      agregarRequerimiento,
      actualizarRequerimiento,
      eliminarRequerimiento,
      solicitarCorreoYEnviar,
      cancelarEnvioCorreo,
      confirmarEnvioCorreo,
      cerrarNotificacion
    }
  }
}
</script>

