
# Enfoque Técnico del Proyecto MiDespacho

# Arquitectura General
Monorepositorio con backend (NestJS) y frontend (Angular) independientes.
Base de datos PostgreSQL con TypeORM para modelado y persistencia.
Comunicación vía REST API con CORS configurado para entorno local.

# Backend (NestJS + TypeORM)
Tres entidades principales: Client, Process, Attachment con relaciones definidas.
Módulos independientes para cada entidad (services, controllers, DTOs).
Validación con class-validator en todos los DTOs.
Manejo de archivos: Subida múltiple con Multer, almacenamiento local en /uploads.
Endpoints paginados para listados eficientes.
CORS habilitado para comunicación con frontend en puerto 4200.

# Frontend (Angular + SSR + Tailwind)
Componentes standalone para mejor modularidad y lazy loading
Layout principal con sidebar persistente, header dinámico y footer
Material Angular para componentes UI consistentes (tablas, modales, formularios)
TailwindCSS para estilos rápidos y responsive
Servicios para abstraer comunicación HTTP con el backend

# Funcionalidades Implementadas
Dashboard: Cards con métricas y tabla de próximos vencimientos (7 días)
Procesos: Listado paginado con filtros implícitos (orden por fecha descendente)
CRUD completo de procesos con modales para crear/editar
Modal de detalle con información consolidada (proceso + cliente)
Sistema de anexos (core del reto):
Subida múltiple con FormData
Campos contextuales: título y descripción por conjunto
Listado de anexos por proceso
Eliminación física de archivos + registro en BD

# Decisiones Técnicas Clave
UUID como IDs para escalabilidad y seguridad
Sincronización automática de BD en desarrollo (luego migraciones)
Formularios reactivos con validación en frontend
Snackbars para feedback de operaciones
Modales para evitar navegación y mantener contexto

# Estructura de Datos
Client: nombre, email, teléfono, dirección
Process: título, tipo, estado, fechas, clienteId (FK)
Attachment: nombreArchivo, ruta, tipo, tamaño, títuloContextual, descripciónContextual, procesoId (FK)

# Flujo Crítico: Anexos
Usuario selecciona proceso → clic en "Anexos"
Modal muestra formulario de subida + listado existente
Subida: archivos + título + descripción → FormData → endpoint POST /attachments/upload/:procesoId
Backend guarda archivos en /uploads y registros en BD
Frontend refresca listado automáticamente

# Puntos de Escalabilidad
Módulos "En construcción" para futuras funcionalidades (clientes, facturación, parametrización)
Estructura de carpetas preparada para nuevos features
Servicios desacoplados del UI
Paginación implementada para listados grandes