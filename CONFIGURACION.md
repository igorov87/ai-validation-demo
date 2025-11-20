# Configuración del Proyecto

## Variables de Entorno

Este proyecto utiliza variables de entorno para configurar las URLs de las APIs y otras configuraciones. Los archivos `.env` están bloqueados por seguridad, pero aquí están las configuraciones necesarias:

### Archivo `.env.development`

Crear este archivo en la raíz del proyecto con el siguiente contenido:

```env
# API URLs
VITE_API_REQUERIMIENTOS_URL=http://localhost:3000/api
VITE_API_NOTIFICACIONES_URL=https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app

# App Config
VITE_APP_NAME=Sistema de Requerimientos - DEV

# Features
VITE_ENABLE_LOGS=true
```

### Archivo `.env.production`

Crear este archivo en la raíz del proyecto con el siguiente contenido:

```env
# API URLs
VITE_API_REQUERIMIENTOS_URL=https://api.empresa.com/requerimientos
VITE_API_NOTIFICACIONES_URL=https://is-cr-notify-api-notify-master-m3pd7zj7mq-uc.a.run.app

# App Config
VITE_APP_NAME=Sistema de Requerimientos

# Features
VITE_ENABLE_LOGS=false
```

## API de Notificaciones

La aplicación utiliza la **API de Notificaciones de Interseguro** para enviar correos electrónicos.

### Documentación

- **Página de Confluence**: [API de Notificaciones](https://interseguro.atlassian.net/wiki/spaces/GDA/pages/169476564)
- **Espacio**: Gobierno de APIs

### Endpoints

#### Producción
```
https://is-cr-notify-api-notify-master-m3pd7zj7mq-uc.a.run.app/v1/notify/email
```

#### UAT/Test
```
https://is-cr-notify-api-notify-test-m3pd7zj7mq-uc.a.run.app/v1/notify/email
```

### Estructura de Petición

```json
{
  "title": "Título del email",
  "subject": "Asunto del email",
  "htmlContent": "<html>...</html>",
  "priority": "normal",
  "from": {
    "name": "Sistema de Requerimientos",
    "email": "noreply@interseguro.com.pe"
  },
  "to": [
    {
      "email": "destinatario@ejemplo.com"
    }
  ]
}
```

### Respuesta

```json
{
  "status": "success",
  "message": "Email encolado correctamente",
  "idCreated": "abc123..."
}
```

## Estructura del Proyecto

```
ai-validation-demo/
│
├── src/
│   ├── api/                          # Instancias axios
│   │   ├── requerimientos.js
│   │   └── notificaciones.js
│   │
│   ├── components/                   # Componentes Vue
│   │   ├── ListaRequerimientos.vue
│   │   ├── RegistroRequerimiento.vue
│   │   └── NotificacionToast.vue
│   │
│   ├── composables/                  # Lógica reactiva
│   │   ├── useRequerimiento.js
│   │   └── useNotificacion.js
│   │
│   ├── services/                     # Lógica de negocio
│   │   ├── requerimiento.service.js
│   │   └── notificacion.service.js
│   │
│   ├── config.js                     # Variables de entorno
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── .env.development                  # Variables de entorno - desarrollo
├── .env.production                   # Variables de entorno - producción
├── package.json
└── README.md
```

## Comandos

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

## Funcionalidades Implementadas (HU GENAI-12)

### ✅ 1. Botón de Envío por Correo
- Botón verde con ícono de sobre junto a cada requerimiento
- Modal para solicitar correo del destinatario
- Integración con API de Notificaciones de Interseguro
- Email con formato HTML profesional

### ✅ 2. Ícono de Edición
- Ícono de lápiz azul junto a cada requerimiento
- Claramente identificable y con hover effect

### ✅ 3. Formulario de Edición
- Mismo formulario usado para crear
- Campos precargados con datos existentes
- Título dinámico: "Nuevo Requerimiento" o "Editar Requerimiento"

### ✅ 4. Actualización del Requerimiento
- Validación de campos al guardar
- Botón con texto "Guardar"
- Actualización en tiempo real del listado

### ✅ 5. Notificación de Éxito
- Notificación en parte inferior derecha
- Desaparece automáticamente después de 5 segundos
- Diferentes colores según tipo (éxito, error, advertencia)

### ✅ 6. Manejo de Errores
- Mensajes de error claros
- Formulario no se cierra en caso de error
- Logging apropiado en consola

### ✅ 7. Persistencia
- Cambios reflejados inmediatamente en la tabla
- Estado reactivo con Vue 3 Composition API

## Arquitectura

El proyecto sigue una **arquitectura en capas**:

```
Componentes Vue → Composables → Services → API (axios) → Backend
```

### Capas

1. **Componentes Vue**: Capa de presentación (UI y eventos)
2. **Composables**: Lógica reactiva reutilizable
3. **Services**: Lógica de negocio y validaciones
4. **API (axios)**: Comunicación HTTP con interceptors

## Seguridad

- Validación de datos en frontend
- Sanitización de inputs del usuario
- Manejo seguro de errores
- No exposición de información sensible
- Uso de parámetros de axios (no concatenación de URLs)

## Notas Adicionales

- El proyecto usa **Vue 3** con **Composition API**
- **Tailwind CSS** para estilos
- **Vite** como bundler
- Nomenclatura en español según estándares del proyecto
- Logs con emojis para fácil identificación

