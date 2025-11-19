<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      Requerimientos Registrados
      <span class="text-gray-500 text-lg font-normal">
        ({{ requerimientos.length }})
      </span>
    </h2>

    <div v-if="requerimientos.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500 text-lg">No hay requerimientos registrados aún.</p>
      <p class="text-gray-400 mt-2">Haga clic en "Nuevo Requerimiento" para comenzar.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="requerimiento in requerimientos"
        :key="requerimiento.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <span
              :class="getBadgeClass(requerimiento.tipo)"
              class="px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ getTipoLabel(requerimiento.tipo) }}
            </span>
            <span
              :class="getPrioridadClass(requerimiento.prioridad)"
              class="px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ getPrioridadLabel(requerimiento.prioridad) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <!-- Botón Editar -->
            <button
              @click="$emit('editar', requerimiento)"
              class="text-blue-500 hover:text-blue-700 transition duration-200"
              title="Editar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <!-- Botón Enviar por Correo -->
            <button
              @click="confirmarEnviarCorreo(requerimiento)"
              class="text-green-500 hover:text-green-700 transition duration-200"
              title="Enviar por correo"
              :disabled="!requerimiento.email"
              :class="{ 'opacity-50 cursor-not-allowed': !requerimiento.email }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <!-- Botón Eliminar -->
            <button
              @click="confirmarEliminar(requerimiento.id)"
              class="text-red-500 hover:text-red-700 transition duration-200"
              title="Eliminar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-500">Cliente</p>
            <p class="font-semibold text-gray-800">{{ requerimiento.nombreCliente }}</p>
          </div>
          <div v-if="requerimiento.numeroPoliza">
            <p class="text-sm text-gray-500">Número de Póliza</p>
            <p class="font-semibold text-gray-800">{{ requerimiento.numeroPoliza }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Teléfono</p>
            <p class="font-semibold text-gray-800">{{ requerimiento.telefono }}</p>
          </div>
          <div v-if="requerimiento.email">
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-semibold text-gray-800">{{ requerimiento.email }}</p>
          </div>
        </div>

        <div v-if="requerimiento.tipoSiniestro" class="mb-4">
          <p class="text-sm text-gray-500">Tipo de Siniestro</p>
          <p class="font-semibold text-gray-800">{{ requerimiento.tipoSiniestro }}</p>
        </div>

        <div v-if="requerimiento.tipoSolicitud" class="mb-4">
          <p class="text-sm text-gray-500">Tipo de Solicitud</p>
          <p class="font-semibold text-gray-800">{{ requerimiento.tipoSolicitud }}</p>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-1">Descripción</p>
          <p class="text-gray-800 whitespace-pre-wrap">{{ requerimiento.descripcion }}</p>
        </div>

        <div v-if="requerimiento.observaciones" class="mb-4">
          <p class="text-sm text-gray-500 mb-1">Observaciones</p>
          <p class="text-gray-600 text-sm whitespace-pre-wrap">{{ requerimiento.observaciones }}</p>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-400">Registrado el: {{ requerimiento.fechaRegistro }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListaRequerimientos',
  props: {
    requerimientos: {
      type: Array,
      required: true
    }
  },
  emits: ['eliminar', 'editar', 'enviarCorreo'],
  methods: {
    getTipoLabel(tipo) {
      const labels = {
        reclamo: 'Reclamo',
        solicitud: 'Solicitud',
        consulta: 'Consulta',
        queja: 'Queja',
        sugerencia: 'Sugerencia'
      }
      return labels[tipo] || tipo
    },
    getBadgeClass(tipo) {
      const classes = {
        reclamo: 'bg-red-100 text-red-800',
        solicitud: 'bg-blue-100 text-blue-800',
        consulta: 'bg-green-100 text-green-800',
        queja: 'bg-orange-100 text-orange-800',
        sugerencia: 'bg-purple-100 text-purple-800'
      }
      return classes[tipo] || 'bg-gray-100 text-gray-800'
    },
    getPrioridadLabel(prioridad) {
      const labels = {
        baja: 'Baja',
        media: 'Media',
        alta: 'Alta',
        urgente: 'Urgente'
      }
      return labels[prioridad] || prioridad
    },
    getPrioridadClass(prioridad) {
      const classes = {
        baja: 'bg-gray-100 text-gray-800',
        media: 'bg-yellow-100 text-yellow-800',
        alta: 'bg-orange-100 text-orange-800',
        urgente: 'bg-red-100 text-red-800'
      }
      return classes[prioridad] || 'bg-gray-100 text-gray-800'
    },
    confirmarEliminar(id) {
      if (confirm('¿Está seguro de que desea eliminar este requerimiento?')) {
        this.$emit('eliminar', id)
      }
    },
    confirmarEnviarCorreo(requerimiento) {
      if (!requerimiento.email) {
        alert('Este requerimiento no tiene un email asociado')
        return
      }
      
      if (confirm(`¿Desea enviar este requerimiento por correo a ${requerimiento.email}?`)) {
        this.$emit('enviarCorreo', requerimiento)
      }
    }
  }
}
</script>

