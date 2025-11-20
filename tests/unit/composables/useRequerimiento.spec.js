import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRequerimiento } from '@/composables/useRequerimiento'
import { requerimientoService } from '@/services/requerimiento.service'
import { correoService } from '@/services/correo.service'

// Mock de los servicios
vi.mock('@/services/requerimiento.service')
vi.mock('@/services/correo.service')

describe('useRequerimiento', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe inicializar con valores por defecto', () => {
    const { requerimientos, loading, error, notificacion } = useRequerimiento()
    
    expect(requerimientos.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(notificacion.value).toBeNull()
  })

  describe('crearRequerimiento', () => {
    it('debe crear un requerimiento exitosamente', async () => {
      const mockData = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción de prueba'
      }

      const mockResponse = { id: '123', ...mockData }
      vi.mocked(requerimientoService.crearRequerimiento).mockResolvedValue(mockResponse)

      const { crearRequerimiento, requerimientos, notificacion } = useRequerimiento()
      const resultado = await crearRequerimiento(mockData)

      expect(resultado.id).toBe('123')
      expect(requerimientos.value).toHaveLength(1)
      expect(requerimientos.value[0].id).toBe('123')
      expect(notificacion.value?.tipo).toBe('success')
    })

    it('debe rechazar requerimiento con datos incompletos', async () => {
      const datosIncompletos = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez'
        // Falta telefono y descripcion
      }

      const { crearRequerimiento, error, notificacion } = useRequerimiento()
      const resultado = await crearRequerimiento(datosIncompletos)

      expect(resultado).toBeNull()
      expect(error.value).toBeTruthy()
      expect(notificacion.value?.tipo).toBe('error')
    })

    it('debe manejar errores del servicio', async () => {
      const mockData = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción de prueba'
      }

      vi.mocked(requerimientoService.crearRequerimiento).mockRejectedValue(
        new Error('Error del servidor')
      )

      const { crearRequerimiento, error, notificacion } = useRequerimiento()
      const resultado = await crearRequerimiento(mockData)

      expect(resultado).toBeNull()
      expect(error.value).toBe('Error del servidor')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })

  describe('actualizarRequerimiento', () => {
    it('debe actualizar un requerimiento exitosamente', async () => {
      const mockData = {
        tipo: 'consulta',
        nombreCliente: 'María García',
        telefono: '987654321',
        prioridad: 'media',
        descripcion: 'Descripción actualizada'
      }

      const mockResponse = { id: '123', ...mockData }
      vi.mocked(requerimientoService.actualizarRequerimiento).mockResolvedValue(mockResponse)

      const { actualizarRequerimiento, requerimientos, notificacion } = useRequerimiento()
      
      // Agregar un requerimiento inicial
      requerimientos.value.push({ id: '123', nombreCliente: 'Nombre Antiguo' })
      
      const resultado = await actualizarRequerimiento('123', mockData)

      expect(resultado.id).toBe('123')
      expect(requerimientos.value[0].nombreCliente).toBe('María García')
      expect(notificacion.value?.tipo).toBe('success')
    })

    it('debe manejar errores al actualizar', async () => {
      const mockData = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción de prueba'
      }

      vi.mocked(requerimientoService.actualizarRequerimiento).mockRejectedValue(
        new Error('Error de validación')
      )

      const { actualizarRequerimiento, error, notificacion } = useRequerimiento()
      const resultado = await actualizarRequerimiento('123', mockData)

      expect(resultado).toBeNull()
      expect(error.value).toBe('Error de validación')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })

  describe('eliminarRequerimiento', () => {
    it('debe eliminar un requerimiento exitosamente', async () => {
      vi.mocked(requerimientoService.eliminarRequerimiento).mockResolvedValue()

      const { eliminarRequerimiento, requerimientos, notificacion } = useRequerimiento()
      
      // Agregar requerimientos iniciales
      requerimientos.value.push(
        { id: '123', nombreCliente: 'Cliente 1' },
        { id: '456', nombreCliente: 'Cliente 2' }
      )
      
      const resultado = await eliminarRequerimiento('123')

      expect(resultado).toBe(true)
      expect(requerimientos.value).toHaveLength(1)
      expect(requerimientos.value[0].id).toBe('456')
      expect(notificacion.value?.tipo).toBe('success')
    })

    it('debe manejar errores al eliminar', async () => {
      vi.mocked(requerimientoService.eliminarRequerimiento).mockRejectedValue(
        new Error('Error al eliminar')
      )

      const { eliminarRequerimiento, error, notificacion } = useRequerimiento()
      const resultado = await eliminarRequerimiento('123')

      expect(resultado).toBe(false)
      expect(error.value).toBe('Error al eliminar')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })

  describe('enviarPorCorreo', () => {
    it('debe enviar un requerimiento por correo exitosamente', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '987654321',
        descripcion: 'Descripción'
      }

      const mockResponse = {
        success: true,
        message: 'Correo enviado'
      }

      vi.mocked(correoService.enviarRequerimientoPorCorreo).mockResolvedValue(mockResponse)

      const { enviarPorCorreo, notificacion } = useRequerimiento()
      const resultado = await enviarPorCorreo(mockRequerimiento)

      expect(resultado.success).toBe(true)
      expect(notificacion.value?.tipo).toBe('success')
      expect(correoService.enviarRequerimientoPorCorreo).toHaveBeenCalledWith(
        mockRequerimiento,
        null
      )
    })

    it('debe rechazar envío si no hay email', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez'
        // Sin email
      }

      const { enviarPorCorreo, error, notificacion } = useRequerimiento()
      const resultado = await enviarPorCorreo(mockRequerimiento)

      expect(resultado).toBeNull()
      expect(error.value).toBeTruthy()
      expect(notificacion.value?.tipo).toBe('error')
    })

    it('debe manejar errores al enviar correo', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com'
      }

      vi.mocked(correoService.enviarRequerimientoPorCorreo).mockRejectedValue(
        new Error('Error al enviar correo')
      )

      const { enviarPorCorreo, error, notificacion } = useRequerimiento()
      const resultado = await enviarPorCorreo(mockRequerimiento)

      expect(resultado).toBeNull()
      expect(error.value).toBe('Error al enviar correo')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })

  describe('obtenerRequerimiento', () => {
    it('debe obtener un requerimiento por ID', async () => {
      const mockRequerimiento = {
        id: '123',
        nombreCliente: 'Juan Pérez',
        tipo: 'reclamo'
      }

      vi.mocked(requerimientoService.obtenerRequerimientoPorId).mockResolvedValue(mockRequerimiento)

      const { obtenerRequerimiento } = useRequerimiento()
      const resultado = await obtenerRequerimiento('123')

      expect(resultado.id).toBe('123')
      expect(requerimientoService.obtenerRequerimientoPorId).toHaveBeenCalledWith('123')
    })

    it('debe manejar errores al obtener requerimiento', async () => {
      vi.mocked(requerimientoService.obtenerRequerimientoPorId).mockRejectedValue(
        new Error('Requerimiento no encontrado')
      )

      const { obtenerRequerimiento, error, notificacion } = useRequerimiento()
      const resultado = await obtenerRequerimiento('999')

      expect(resultado).toBeNull()
      expect(error.value).toBe('Requerimiento no encontrado')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })

  describe('listarRequerimientos', () => {
    it('debe listar todos los requerimientos', async () => {
      const mockData = {
        data: [
          { id: '1', nombreCliente: 'Cliente 1' },
          { id: '2', nombreCliente: 'Cliente 2' }
        ]
      }

      vi.mocked(requerimientoService.obtenerRequerimientos).mockResolvedValue(mockData)

      const { listarRequerimientos, requerimientos } = useRequerimiento()
      await listarRequerimientos()

      expect(requerimientos.value).toHaveLength(2)
      expect(requerimientos.value[0].id).toBe('1')
    })

    it('debe manejar errores al listar', async () => {
      vi.mocked(requerimientoService.obtenerRequerimientos).mockRejectedValue(
        new Error('Error de conexión')
      )

      const { listarRequerimientos, error, notificacion } = useRequerimiento()
      await listarRequerimientos()

      expect(error.value).toBe('Error de conexión')
      expect(notificacion.value?.tipo).toBe('error')
    })
  })
})

