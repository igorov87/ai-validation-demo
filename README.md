# Sistema de Registro de Requerimientos

Sistema desarrollado con Vue 3 + Vite para el registro y gestión de requerimientos de clientes de Interseguro.

## 🚀 Características

### ✅ CRUD Completo de Requerimientos
- ✨ Crear nuevos requerimientos
- ✏️ Editar requerimientos existentes
- 🗑️ Eliminar requerimientos
- 📋 Listar todos los requerimientos

### ✅ Envío de Correos Electrónicos
- 📧 Envío de requerimientos por correo
- 🎨 Emails con formato HTML profesional
- 🔗 Integración con API de Notificaciones de Interseguro

### ✅ Sistema de Notificaciones
- 🔔 Notificaciones toast en tiempo real
- ✅ Notificaciones de éxito
- ❌ Notificaciones de error
- ⚠️ Notificaciones de advertencia

### ✅ Validaciones y Seguridad
- 🛡️ Validación de datos en frontend
- 🧹 Sanitización de inputs
- 🔒 Manejo seguro de errores

## 📋 Historia de Usuario Implementada

**HU GENAI-12**: Editar registros en sistema de requerimientos

Todos los criterios de aceptación han sido implementados:
1. ✅ Botón "Enviar por correo" con integración a API
2. ✅ Ícono de lápiz para editar
3. ✅ Formulario de edición con datos precargados
4. ✅ Botón "Guardar" con validaciones
5. ✅ Notificación en parte inferior derecha
6. ✅ Manejo de errores con mensajes claros
7. ✅ Persistencia inmediata en el listado

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── api/                    # Instancias axios
│   ├── requerimientos.js
│   └── notificaciones.js
├── components/             # Componentes Vue
│   ├── ListaRequerimientos.vue
│   ├── RegistroRequerimiento.vue
│   └── NotificacionToast.vue
├── composables/            # Lógica reactiva
│   ├── useRequerimiento.js
│   └── useNotificacion.js
├── services/               # Lógica de negocio
│   ├── requerimiento.service.js
│   └── notificacion.service.js
├── config.js              # Configuración centralizada
├── App.vue
└── main.js
```

### Capas de la Aplicación

```
Componentes Vue → Composables → Services → API (axios) → Backend
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.development` en la raíz:

```env
VITE_API_REQUERIMIENTOS_URL=http://localhost:3000/api
VITE_API_NOTIFICACIONES_URL=https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app
VITE_APP_NAME=Sistema de Requerimientos - DEV
VITE_ENABLE_LOGS=true
```

Para más detalles, ver [CONFIGURACION.md](CONFIGURACION.md)

## 🚀 Instalación y Ejecución

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
npm run build
npm run preview
```

## 📚 API de Notificaciones

La aplicación utiliza la **API de Notificaciones de Interseguro** documentada en Confluence:

- **Documentación**: [Gobierno de APIs - API de Notificaciones](https://interseguro.atlassian.net/wiki/spaces/GDA/pages/169476564)
- **Endpoint UAT**: `https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app/v1/notify/email`
- **Endpoint PRD**: `https://is-cr-notify-api-notify-master-m3pd7zj7mq-uc.a.run.app/v1/notify/email`

## 🎨 Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework de CSS utility-first
- **Axios** - Cliente HTTP para peticiones
- **Composition API** - API de composición de Vue 3

## 📝 Estándares de Código

El proyecto sigue los estándares definidos en las reglas del workspace:

- ✅ Nomenclatura en español
- ✅ Arquitectura en capas
- ✅ Validaciones y sanitización
- ✅ Manejo de errores
- ✅ Logs estructurados
- ✅ Código moderno (ES6+)

## 🔍 Funcionalidades Detalladas

### Crear Requerimiento
1. Click en "Nuevo Requerimiento"
2. Llenar formulario con datos del cliente
3. Click en "Guardar"
4. Notificación de éxito

### Editar Requerimiento
1. Click en ícono de lápiz (azul)
2. Modificar datos necesarios
3. Click en "Guardar"
4. Notificación de actualización exitosa

### Enviar por Correo
1. Click en ícono de sobre (verde)
2. Ingresar email del destinatario
3. Click en "Enviar"
4. Email se envía con formato profesional

### Eliminar Requerimiento
1. Click en ícono de basura (rojo)
2. Confirmar eliminación
3. Requerimiento removido del listado

## 👥 Contribución

El proyecto sigue las mejores prácticas de desarrollo:
- Early returns para validaciones
- Funciones pequeñas (< 50 líneas)
- Single Responsibility Principle
- Composables para lógica reutilizable
- Servicios para lógica de negocio

## 📖 Documentación Adicional

- [CONFIGURACION.md](CONFIGURACION.md) - Configuración detallada del proyecto

## 🐛 Troubleshooting

### Errores comunes

**Error: Cannot find module 'axios'**
```bash
npm install axios
```

**Error: Variables de entorno no cargadas**
- Verificar que exista archivo `.env.development`
- Verificar que las variables tengan prefijo `VITE_`

**Error al enviar correos**
- Verificar conectividad a internet
- Verificar URL de API de Notificaciones
- Ver logs en consola del navegador

## 📄 Licencia

Interseguro © 2025
