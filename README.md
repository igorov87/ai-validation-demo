# Sistema de Registro de Requerimientos

## Descripción y propósito

Sistema frontend desarrollado con Vue.js 3 para la gestión integral de requerimientos de clientes en Interseguro. Permite el registro, edición, consulta y envío por correo electrónico de diferentes tipos de requerimientos (reclamos, solicitudes, consultas, quejas y sugerencias).

La aplicación está diseñada con una arquitectura en capas que facilita el mantenimiento, escalabilidad y pruebas. Implementa validaciones robustas en múltiples niveles, sanitización de datos y medidas de seguridad para proteger la información de los clientes.

**Características principales:**
- ✅ Registro de requerimientos con campos específicos según tipo
- ✅ Edición completa de requerimientos existentes
- ✅ Envío de requerimientos por correo electrónico
- ✅ Sistema de prioridades (Baja, Media, Alta, Urgente)
- ✅ Notificaciones toast para feedback inmediato
- ✅ Validación en múltiples capas (UI, composables, servicios)
- ✅ Interfaz responsive y moderna con Tailwind CSS

## Repositorio

```
https://github.com/interseguro/genai/tests/ai-validation-demo
```

## Requisitos

Para preparar el ambiente de desarrollo se necesitan los siguientes requisitos:

- **Node.js**: versión 16.x o superior
- **npm**: versión 8.x o superior (incluido con Node.js)
- **Git**: para clonar el repositorio
- **Editor de código**: Visual Studio Code o similar (recomendado)
- **Navegador moderno**: Chrome, Firefox, Edge o Safari (última versión)
- **Conexión a internet**: para descargar dependencias

**Verificar versiones instaladas:**
```bash
node --version   # Debe ser v16.x o superior
npm --version    # Debe ser v8.x o superior
```

## Estructura del proyecto

```
ai-validation-demo/
├── src/                                    # Código fuente de la aplicación
│   ├── api/                                # Instancias axios para comunicación con APIs
│   │   ├── requerimientos.js               # Cliente HTTP para API de requerimientos
│   │   └── correo.js                       # Cliente HTTP para API de correo
│   │
│   ├── services/                           # Capa de lógica de negocio
│   │   ├── requerimiento.service.js        # Validaciones y transformación de datos de requerimientos
│   │   └── correo.service.js               # Lógica de negocio para envío de correos
│   │
│   ├── composables/                        # Lógica reactiva reutilizable (Composition API)
│   │   └── useRequerimiento.js             # Composable principal con estado y métodos reactivos
│   │
│   ├── components/                         # Componentes Vue reutilizables
│   │   ├── RegistroRequerimiento.vue       # Formulario de creación/edición de requerimientos
│   │   ├── ListaRequerimientos.vue         # Lista con acciones de editar/enviar/eliminar
│   │   └── ToastNotification.vue           # Sistema de notificaciones emergentes
│   │
│   ├── config.js                           # Configuración centralizada y variables de entorno
│   ├── App.vue                             # Componente raíz de la aplicación
│   ├── main.js                             # Punto de entrada de JavaScript
│   └── style.css                           # Estilos globales y configuración Tailwind
│
├── tests/                                  # Pruebas unitarias
│   └── unit/                               # Pruebas unitarias con Vitest
│       ├── services/                       # Pruebas de servicios
│       │   ├── requerimiento.service.spec.js
│       │   └── correo.service.spec.js
│       └── composables/                    # Pruebas de composables
│           └── useRequerimiento.spec.js
│
├── .env.development                        # Variables de entorno para desarrollo
├── .env.production                         # Variables de entorno para producción
├── index.html                              # HTML base de la aplicación
├── package.json                            # Dependencias y scripts del proyecto
├── package-lock.json                       # Lock de versiones exactas de dependencias
├── vite.config.js                          # Configuración de Vite (build tool)
├── vitest.config.js                        # Configuración de Vitest (testing)
├── tailwind.config.js                      # Configuración de Tailwind CSS
├── postcss.config.js                       # Configuración de PostCSS
├── IMPLEMENTACION_GENAI-12.md              # Documentación técnica de implementación
└── README.md                               # Este archivo
```

## Quickstart

Para levantar este servicio en ambiente local, ejecutar los siguientes comandos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/interseguro/genai/tests/ai-validation-demo.git
cd ai-validation-demo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (copiar archivo de ejemplo)
cp .env.example .env.development

# 4. Editar .env.development con las URLs de las APIs según tu entorno
# (Opcional: el proyecto funciona con localStorage si no se configuran APIs)

# 5. Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173
```

**Comandos adicionales:**

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas en modo watch (para desarrollo)
npm run test:watch

# Generar reporte de cobertura de código
npm run test:coverage

# Compilar para producción
npm run build

# Previsualizar build de producción localmente
npm run preview
```

## Configuración esencial

Variables de entorno necesarias para levantar este servicio:

### Archivo `.env.development` (Desarrollo)

```env
# URLs de APIs backend
VITE_API_REQUERIMIENTOS_URL=http://localhost:3000/api
VITE_API_CORREO_URL=http://localhost:3000/api/correo

# Configuración de la aplicación
VITE_APP_NAME=Sistema de Requerimientos - DEV

# Feature flags
VITE_ENABLE_LOGS=true

# Timeouts (en milisegundos)
VITE_API_TIMEOUT=30000

# Duración de notificaciones (en milisegundos)
VITE_NOTIFICATION_DURATION=3000
```

### Archivo `.env.production` (Producción)

```env
# URLs de APIs backend en producción
VITE_API_REQUERIMIENTOS_URL=https://api.interseguro.com/requerimientos
VITE_API_CORREO_URL=https://api.interseguro.com/correo

# Configuración de la aplicación
VITE_APP_NAME=Sistema de Requerimientos

# Feature flags
VITE_ENABLE_LOGS=false

# Timeouts (en milisegundos)
VITE_API_TIMEOUT=30000

# Duración de notificaciones (en milisegundos)
VITE_NOTIFICATION_DURATION=3000
```

**Nota importante:** En Vite, todas las variables de entorno expuestas al cliente deben tener el prefijo `VITE_`. Las variables sin este prefijo no estarán disponibles en el código frontend.

### APIs Backend Requeridas

El frontend espera las siguientes APIs backend:

**API de Requerimientos:**
- `GET /api/requerimientos` - Listar requerimientos
- `GET /api/requerimientos/:id` - Obtener un requerimiento específico
- `POST /api/requerimientos` - Crear nuevo requerimiento
- `PUT /api/requerimientos/:id` - Actualizar requerimiento existente
- `DELETE /api/requerimientos/:id` - Eliminar requerimiento

**API de Correo:**
- `POST /api/correo/enviar` - Enviar requerimiento por correo electrónico

Si no se configuran las APIs, la aplicación funciona con localStorage para desarrollo y pruebas locales.

## Despliegue

**Dónde vive:** GCP Cloud Run

**Ambientes:** Dev / Stg / Prod → `docs/deployment.md`

---

## Tecnologías Utilizadas

- **Vue.js 3** - Framework JavaScript con Composition API
- **Tailwind CSS** - Framework de estilos CSS utility-first
- **Vite** - Build tool y servidor de desarrollo ultrarrápido
- **Axios** - Cliente HTTP para llamadas a APIs
- **Vitest** - Framework de testing unitario compatible con Vite

## Arquitectura

El proyecto sigue una **arquitectura en capas** para separación de responsabilidades:

```
┌─────────────────────────────────────────────┐
│         Componentes Vue (UI)                 │
│  RegistroRequerimiento → ListaRequerimientos │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Composables (Lógica Reactiva)           │
│  useRequerimiento.js                         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Services (Lógica de Negocio)            │
│  requerimiento.service + correo.service      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      API (Cliente HTTP - Axios)              │
│  requerimientos.js + correo.js               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
            [ Backend API ]
```

## Seguridad

El proyecto implementa medidas de seguridad en frontend:

✅ **Validación en múltiples capas** (UI, composables, servicios)  
✅ **Sanitización de datos** antes de enviar a APIs  
✅ **Protección contra XSS** (escape automático de Vue)  
✅ **Validación contra listas blancas** para valores limitados  
✅ **Límites de longitud** en todos los campos  
✅ **Sanitización de IDs** antes de usar en URLs  
✅ **Manejo seguro de errores** sin exponer información sensible

## Pruebas

El proyecto incluye pruebas unitarias completas con **Vitest**:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar en modo watch (para desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

**Cobertura actual:**
- ✅ Services: `requerimiento.service.js` y `correo.service.js`
- ✅ Composables: `useRequerimiento.js`
- ✅ 36 tests unitarios en total

## Documentación Adicional

- **Implementación técnica:** Ver archivo `IMPLEMENTACION_GENAI-12.md`
- **Estándares de código:** Ver `.cursor/rules/` para guidelines de desarrollo
- **APIs de Gobierno:** Confluence - "Gobierno de APIs" (ID: 169476516)
- **Sistemas Interseguro:** Confluence - "Documentación de Sistemas" (ID: 183173567)

## Contribuir

Para contribuir al proyecto:

1. Seguir los estándares de código definidos en `.cursor/rules/`
2. Ejecutar pruebas antes de hacer commit: `npm run test`
3. Usar nomenclatura consistente (camelCase para variables, kebab-case para archivos)
4. Documentar funciones públicas con JSDoc
5. Mantener funciones pequeñas (máximo 50 líneas)
6. Implementar validaciones y manejo de errores apropiados

## Soporte

Para consultas técnicas o reportar problemas:
- **Jira:** Crear ticket en proyecto GENAI
- **Confluence:** Documentación en espacios de Interseguro
- **Contacto:** Equipo de desarrollo de Interseguro

---

**Última actualización:** 19 de Noviembre, 2025  
**Versión:** 1.0.0  
**Licencia:** Propiedad de Interseguro
