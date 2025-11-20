<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ modoEdicion ? 'Editar Requerimiento' : 'Nuevo Requerimiento' }}
        </h2>
        <button
          @click="$emit('cerrar')"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <form @submit.prevent="guardar" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Requerimiento <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formulario.tipo"
            @change="resetearCamposEspecificos"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="reclamo">Reclamo</option>
            <option value="solicitud">Solicitud</option>
            <option value="consulta">Consulta</option>
            <option value="queja">Queja</option>
            <option value="sugerencia">Sugerencia</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Cliente <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formulario.nombreCliente"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Póliza
            </label>
            <input
              v-model="formulario.numeroPoliza"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formulario.telefono"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="formulario.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div v-if="formulario.tipo === 'reclamo'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Siniestro
          </label>
          <select
            v-model="formulario.tipoSiniestro"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            <option value="accidente">Accidente</option>
            <option value="robo">Robo</option>
            <option value="incendio">Incendio</option>
            <option value="daños">Daños a terceros</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div v-if="formulario.tipo === 'solicitud'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Solicitud
          </label>
          <select
            v-model="formulario.tipoSolicitud"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            <option value="cobertura">Modificación de Cobertura</option>
            <option value="cancelacion">Cancelación</option>
            <option value="renovacion">Renovación</option>
            <option value="endoso">Endoso</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prioridad <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formulario.prioridad"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formulario.descripcion"
            rows="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa el requerimiento en detalle..."
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Observaciones Adicionales
          </label>
          <textarea
            v-model="formulario.observaciones"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Información adicional relevante..."
          ></textarea>
        </div>

        <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

export default {
  name: 'RegistroRequerimiento',
  props: {
    requerimientoEditar: {
      type: Object,
      default: null
    }
  },
  emits: ['cerrar', 'guardar', 'actualizar'],
  setup(props, { emit }) {
    const modoEdicion = computed(() => props.requerimientoEditar !== null)

    const formulario = ref({
      tipo: '',
      nombreCliente: '',
      numeroPoliza: '',
      telefono: '',
      email: '',
      tipoSiniestro: '',
      tipoSolicitud: '',
      prioridad: 'media',
      descripcion: '',
      observaciones: ''
    })

    // Cargar datos si estamos en modo edición
    watch(
      () => props.requerimientoEditar,
      (nuevoRequerimiento) => {
        if (nuevoRequerimiento) {
          formulario.value = {
            tipo: nuevoRequerimiento.tipo || '',
            nombreCliente: nuevoRequerimiento.nombreCliente || '',
            numeroPoliza: nuevoRequerimiento.numeroPoliza || '',
            telefono: nuevoRequerimiento.telefono || '',
            email: nuevoRequerimiento.email || '',
            tipoSiniestro: nuevoRequerimiento.tipoSiniestro || '',
            tipoSolicitud: nuevoRequerimiento.tipoSolicitud || '',
            prioridad: nuevoRequerimiento.prioridad || 'media',
            descripcion: nuevoRequerimiento.descripcion || '',
            observaciones: nuevoRequerimiento.observaciones || ''
          }
        }
      },
      { immediate: true }
    )

    const resetearCamposEspecificos = () => {
      formulario.value.tipoSiniestro = ''
      formulario.value.tipoSolicitud = ''
    }

    const guardar = () => {
      if (modoEdicion.value) {
        // Modo edición: emitir evento actualizar con ID
        emit('actualizar', props.requerimientoEditar.id, { ...formulario.value })
      } else {
        // Modo creación: emitir evento guardar
        emit('guardar', { ...formulario.value })
      }
      
      // Resetear formulario solo en modo creación
      if (!modoEdicion.value) {
        formulario.value = {
          tipo: '',
          nombreCliente: '',
          numeroPoliza: '',
          telefono: '',
          email: '',
          tipoSiniestro: '',
          tipoSolicitud: '',
          prioridad: 'media',
          descripcion: '',
          observaciones: ''
        }
      }
    }

    return {
      formulario,
      modoEdicion,
      resetearCamposEspecificos,
      guardar
    }
  }
}
</script>

