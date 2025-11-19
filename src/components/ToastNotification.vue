<template>
  <transition name="slide-fade">
    <div
      v-if="notificacion"
      :class="getToastClass(notificacion.tipo)"
      class="fixed bottom-6 right-6 z-50 max-w-md px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce-in"
    >
      <!-- Icono -->
      <div class="flex-shrink-0">
        <svg
          v-if="notificacion.tipo === 'success'"
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="notificacion.tipo === 'error'"
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else-if="notificacion.tipo === 'warning'"
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Mensaje -->
      <div class="flex-1 text-white font-medium">
        {{ notificacion.mensaje }}
      </div>

      <!-- Botón cerrar -->
      <button
        @click="$emit('cerrar')"
        class="flex-shrink-0 text-white hover:text-gray-200 transition duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ToastNotification',
  props: {
    notificacion: {
      type: Object,
      default: null
    }
  },
  emits: ['cerrar'],
  methods: {
    getToastClass(tipo) {
      const classes = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      }
      return classes[tipo] || 'bg-gray-500'
    }
  }
}
</script>

<style scoped>
/* Animación de entrada/salida */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Animación de entrada con rebote */
@keyframes bounce-in {
  0% {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
  50% {
    transform: translateX(-10px) scale(1.02);
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.4s ease-out;
}
</style>

