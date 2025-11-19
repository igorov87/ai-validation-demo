import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requerimientoService } from '@/services/requerimiento.service'
import requerimientosApi from '@/api/requerimientos'

// Mock de la API
vi.mock('@/api/requerimientos')

describe('requerimientoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('crearRequerimiento', () => {
    it('debe crear un requerimiento con datos válidos', async () => {
      const mockRequest = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción del reclamo de prueba que tiene suficientes caracteres'
      }

      const mockResponse = {
        data: {
          success: true,
          data: { id: '123', ...mockRequest }
        }
      }

      vi.mocked(requerimientosApi.post).mockResolvedValue(mockResponse)

      const resultado = await requerimientoService.crearRequerimiento(mockRequest)

      expect(resultado.id).toBe('123')
      expect(requerimientosApi.post).toHaveBeenCalledWith(
        '/requerimientos',
        expect.objectContaining({
          tipo: 'reclamo',
          nombreCliente: 'Juan Pérez'
        })
      )
    })

    it('debe rechazar nombre de cliente muy corto', async () => {
      const datosInvalidos = {
        tipo: 'reclamo',
        nombreCliente: 'AB',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción válida con suficientes caracteres para pasar validación'
      }

      await expect(
        requerimientoService.crearRequerimiento(datosInvalidos)
      ).rejects.toThrow('nombre del cliente debe tener al menos 3 caracteres')
    })

    it('debe rechazar teléfono inválido', async () => {
      const datosInvalidos = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '123',
        prioridad: 'alta',
        descripcion: 'Descripción válida con suficientes caracteres para pasar validación'
      }

      await expect(
        requerimientoService.crearRequerimiento(datosInvalidos)
      ).rejects.toThrow('teléfono debe tener entre 9 y 15 dígitos')
    })

    it('debe rechazar descripción muy corta', async () => {
      const datosInvalidos = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Corto'
      }

      await expect(
        requerimientoService.crearRequerimiento(datosInvalidos)
      ).rejects.toThrow('descripción debe tener al menos 10 caracteres')
    })

    it('debe rechazar tipo de requerimiento inválido', async () => {
      const datosInvalidos = {
        tipo: 'tipo_invalido',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción válida con suficientes caracteres'
      }

      await expect(
        requerimientoService.crearRequerimiento(datosInvalidos)
      ).rejects.toThrow('Tipo de requerimiento inválido')
    })

    it('debe rechazar prioridad inválida', async () => {
      const datosInvalidos = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'prioridad_invalida',
        descripcion: 'Descripción válida con suficientes caracteres'
      }

      await expect(
        requerimientoService.crearRequerimiento(datosInvalidos)
      ).rejects.toThrow('Prioridad inválida')
    })

    it('debe sanitizar datos antes de enviar', async () => {
      const mockRequest = {
        tipo: 'reclamo',
        nombreCliente: '  Juan Pérez  ',
        telefono: '987-654-321',
        email: '  JUAN@EMAIL.COM  ',
        prioridad: 'alta',
        descripcion: 'Descripción válida con suficientes caracteres'
      }

      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' }
        }
      }

      vi.mocked(requerimientosApi.post).mockResolvedValue(mockResponse)

      await requerimientoService.crearRequerimiento(mockRequest)

      expect(requerimientosApi.post).toHaveBeenCalledWith(
        '/requerimientos',
        expect.objectContaining({
          nombreCliente: 'Juan Pérez',
          telefono: '987654321',
          email: 'juan@email.com'
        })
      )
    })
  })

  describe('actualizarRequerimiento', () => {
    it('debe actualizar un requerimiento con datos válidos', async () => {
      const mockRequest = {
        tipo: 'consulta',
        nombreCliente: 'María García',
        telefono: '987654321',
        prioridad: 'media',
        descripcion: 'Descripción actualizada con suficientes caracteres'
      }

      const mockResponse = {
        data: {
          success: true,
          data: { id: '123', ...mockRequest }
        }
      }

      vi.mocked(requerimientosApi.put).mockResolvedValue(mockResponse)

      const resultado = await requerimientoService.actualizarRequerimiento('123', mockRequest)

      expect(resultado.id).toBe('123')
      expect(requerimientosApi.put).toHaveBeenCalledWith(
        '/requerimientos/123',
        expect.objectContaining({
          nombreCliente: 'María García'
        })
      )
    })

    it('debe rechazar ID inválido', async () => {
      const mockRequest = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción válida'
      }

      await expect(
        requerimientoService.actualizarRequerimiento(null, mockRequest)
      ).rejects.toThrow('ID inválido')
    })
  })

  describe('obtenerRequerimientoPorId', () => {
    it('debe obtener un requerimiento por ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '123',
            nombreCliente: 'Juan Pérez',
            tipo: 'reclamo'
          }
        }
      }

      vi.mocked(requerimientosApi.get).mockResolvedValue(mockResponse)

      const resultado = await requerimientoService.obtenerRequerimientoPorId('123')

      expect(resultado.id).toBe('123')
      expect(requerimientosApi.get).toHaveBeenCalledWith('/requerimientos/123')
    })

    it('debe sanitizar el ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: '123' }
        }
      }

      vi.mocked(requerimientosApi.get).mockResolvedValue(mockResponse)

      await requerimientoService.obtenerRequerimientoPorId('123; DROP TABLE')

      expect(requerimientosApi.get).toHaveBeenCalledWith('/requerimientos/123DROPTABLE')
    })
  })

  describe('eliminarRequerimiento', () => {
    it('debe eliminar un requerimiento por ID', async () => {
      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(requerimientosApi.delete).mockResolvedValue(mockResponse)

      await requerimientoService.eliminarRequerimiento('123')

      expect(requerimientosApi.delete).toHaveBeenCalledWith('/requerimientos/123')
    })
  })

  describe('obtenerRequerimientos', () => {
    it('debe obtener todos los requerimientos', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', nombreCliente: 'Cliente 1' },
            { id: '2', nombreCliente: 'Cliente 2' }
          ]
        }
      }

      vi.mocked(requerimientosApi.get).mockResolvedValue(mockResponse)

      const resultado = await requerimientoService.obtenerRequerimientos()

      expect(resultado.data).toHaveLength(2)
      expect(requerimientosApi.get).toHaveBeenCalledWith('/requerimientos', { params: {} })
    })

    it('debe obtener requerimientos con filtros', async () => {
      const mockResponse = {
        data: {
          data: []
        }
      }

      vi.mocked(requerimientosApi.get).mockResolvedValue(mockResponse)

      await requerimientoService.obtenerRequerimientos({ tipo: 'reclamo', prioridad: 'alta' })

      expect(requerimientosApi.get).toHaveBeenCalledWith('/requerimientos', {
        params: { tipo: 'reclamo', prioridad: 'alta' }
      })
    })
  })
})

