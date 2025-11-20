import { describe, it, expect, vi, beforeEach } from 'vitest'
import { correoService } from '@/services/correo.service'
import correoApi from '@/api/correo'

// Mock de la API
vi.mock('@/api/correo')

describe('correoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('enviarRequerimientoPorCorreo', () => {
    it('debe enviar un requerimiento por correo exitosamente', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción del reclamo',
        fechaRegistro: '2025-11-19 10:30:00'
      }

      // Respuesta según API de Notificaciones de Interseguro
      const mockResponse = {
        status: 201,
        data: {
          status: 'success',
          message: 'Email encolado correctamente',
          idCreated: 'email-123-abc'
        }
      }

      vi.mocked(correoApi.post).mockResolvedValue(mockResponse)

      const resultado = await correoService.enviarRequerimientoPorCorreo(mockRequerimiento)

      expect(resultado.success).toBe(true)
      expect(resultado.emailId).toBe('email-123-abc')
      expect(resultado.destinatario).toBe('juan@example.com')
      
      // Verificar que se llamó con el endpoint correcto
      expect(correoApi.post).toHaveBeenCalledWith(
        '/v1/notify/email',
        expect.objectContaining({
          title: 'Requerimiento #123',
          subject: expect.stringContaining('Requerimiento #123'),
          htmlContent: expect.any(String),
          priority: 'high', // alta -> high
          from: expect.objectContaining({
            email: expect.any(String)
          }),
          to: expect.arrayContaining([
            expect.objectContaining({ email: 'juan@example.com' })
          ])
        })
      )
    })

    it('debe usar el email del requerimiento si no se proporciona destinatario', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'consulta',
        nombreCliente: 'María García',
        email: 'maria@example.com',
        telefono: '987654321',
        prioridad: 'media',
        descripcion: 'Consulta sobre póliza'
      }

      const mockResponse = {
        status: 201,
        data: {
          status: 'success',
          message: 'Email encolado correctamente',
          idCreated: 'email-456'
        }
      }

      vi.mocked(correoApi.post).mockResolvedValue(mockResponse)

      await correoService.enviarRequerimientoPorCorreo(mockRequerimiento)

      expect(correoApi.post).toHaveBeenCalledWith(
        '/v1/notify/email',
        expect.objectContaining({
          to: expect.arrayContaining([
            expect.objectContaining({ email: 'maria@example.com' })
          ])
        })
      )
    })

    it('debe usar un email destino alternativo si se proporciona', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Reclamo importante'
      }

      const mockResponse = {
        status: 201,
        data: {
          status: 'success',
          message: 'Email encolado correctamente',
          idCreated: 'email-789'
        }
      }

      vi.mocked(correoApi.post).mockResolvedValue(mockResponse)

      await correoService.enviarRequerimientoPorCorreo(mockRequerimiento, 'otro@example.com')

      expect(correoApi.post).toHaveBeenCalledWith(
        '/v1/notify/email',
        expect.objectContaining({
          to: expect.arrayContaining([
            expect.objectContaining({ email: 'otro@example.com' })
          ])
        })
      )
    })

    it('debe rechazar requerimiento sin ID', async () => {
      const mockRequerimiento = {
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com'
      }

      await expect(
        correoService.enviarRequerimientoPorCorreo(mockRequerimiento)
      ).rejects.toThrow('El requerimiento debe tener un ID')
    })

    it('debe rechazar si no hay email disponible', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez'
      }

      await expect(
        correoService.enviarRequerimientoPorCorreo(mockRequerimiento)
      ).rejects.toThrow('El email es requerido')
    })

    it('debe rechazar email con formato inválido', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'email-invalido'
      }

      await expect(
        correoService.enviarRequerimientoPorCorreo(mockRequerimiento)
      ).rejects.toThrow('El email no tiene un formato válido')
    })

    it('debe mapear correctamente las prioridades al formato de la API', async () => {
      const prioridades = [
        { prioridadReq: 'baja', prioridadAPI: 'low' },
        { prioridadReq: 'media', prioridadAPI: 'normal' },
        { prioridadReq: 'alta', prioridadAPI: 'high' },
        { prioridadReq: 'urgente', prioridadAPI: 'high' }
      ]

      const mockResponse = {
        status: 201,
        data: {
          status: 'success',
          message: 'Email encolado correctamente',
          idCreated: 'email-test'
        }
      }

      for (const { prioridadReq, prioridadAPI } of prioridades) {
        vi.clearAllMocks()
        vi.mocked(correoApi.post).mockResolvedValue(mockResponse)

        const mockRequerimiento = {
          id: '123',
          tipo: 'consulta',
          nombreCliente: 'Test User',
          email: 'test@example.com',
          telefono: '987654321',
          prioridad: prioridadReq,
          descripcion: 'Descripción de prueba'
        }

        await correoService.enviarRequerimientoPorCorreo(mockRequerimiento)

        expect(correoApi.post).toHaveBeenCalledWith(
          '/v1/notify/email',
          expect.objectContaining({
            priority: prioridadAPI
          })
        )
      }
    })

    it('debe generar contenido HTML válido', async () => {
      const mockRequerimiento = {
        id: '123',
        tipo: 'reclamo',
        nombreCliente: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '987654321',
        prioridad: 'alta',
        descripcion: 'Descripción del reclamo',
        numeroPoliza: 'POL-12345',
        observaciones: 'Observaciones adicionales'
      }

      const mockResponse = {
        status: 201,
        data: {
          status: 'success',
          message: 'Email encolado correctamente',
          idCreated: 'email-html-test'
        }
      }

      vi.mocked(correoApi.post).mockResolvedValue(mockResponse)

      await correoService.enviarRequerimientoPorCorreo(mockRequerimiento)

      const llamada = vi.mocked(correoApi.post).mock.calls[0][1]
      
      expect(llamada.htmlContent).toContain('<!DOCTYPE html>')
      expect(llamada.htmlContent).toContain('Juan Pérez')
      expect(llamada.htmlContent).toContain('POL-12345')
      expect(llamada.htmlContent).toContain('Descripción del reclamo')
      expect(llamada.htmlContent).toContain('Observaciones adicionales')
    })
  })

  describe('validarEmail', () => {
    it('debe validar email correcto', () => {
      expect(() => {
        correoService.validarEmail('usuario@example.com')
      }).not.toThrow()
    })

    it('debe rechazar email vacío', () => {
      expect(() => {
        correoService.validarEmail('')
      }).toThrow('El email es requerido')
    })

    it('debe rechazar email con formato inválido', () => {
      expect(() => {
        correoService.validarEmail('email-invalido')
      }).toThrow('El email no tiene un formato válido')
    })

    it('debe rechazar email sin dominio', () => {
      expect(() => {
        correoService.validarEmail('usuario@')
      }).toThrow('El email no tiene un formato válido')
    })
  })
})

