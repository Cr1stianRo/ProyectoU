================================================================================
                        SISTEMA CMS - HOGAR GERIATRICO
              Plataforma modular de gestion de contenido web
================================================================================

1. DESCRIPCION GENERAL
----------------------
Este proyecto es un CMS (Content Management System) multi-tenant disenado para
hogares geriatricos. Permite a cada usuario registrado crear y personalizar su
propia pagina web a traves de un panel de administracion visual, sin necesidad
de escribir codigo.

El sistema funciona por modulos: cada seccion de la pagina (hero, servicios,
valores, galeria, equipo, etc.) es un modulo independiente con su propio editor,
endpoint API y controlador en el backend. Todo se almacena en MongoDB y se
renderiza dinamicamente en el frontend.

Tambien incluye la opcion de exportar el sitio completo como un ZIP estatico
listo para subir a Netlify, Vercel, GitHub Pages o cualquier hosting.


2. ARQUITECTURA Y ESTRUCTURA DE CARPETAS
-----------------------------------------

ProyectoU/
|
|-- backend/                          # API REST con Node.js + Express
|   |-- src/
|   |   |-- app.js                    # Configuracion de Express (CORS, rutas, static)
|   |   |-- server.js                 # Entry point - levanta el servidor en puerto 4000
|   |   |-- config/
|   |   |   |-- db.js                 # Conexion a MongoDB con Mongoose
|   |   |-- middleware/
|   |   |   |-- authMiddleware.js     # verifyToken (obligatorio) y optionalAuth (flexible)
|   |   |-- models/
|   |   |   |-- User.js              # Modelo de usuario con preferencias
|   |   |   |-- Home/
|   |   |       |-- PageConfig.js     # Modelo principal: secciones por usuario (multi-tenant)
|   |   |       |-- BloquePrincipal.js
|   |   |       |-- Carrusel.js
|   |   |       |-- CuidadoBloque.js
|   |   |       |-- HomeConfig.js
|   |   |-- routes/
|   |   |   |-- authRoutes.js         # Login y registro (publicas)
|   |   |   |-- homeConfigRoutes.js   # Todas las rutas de modulos (GET/PUT)
|   |   |   |-- uploadRoutes.js       # Subida de imagenes con Multer
|   |   |   |-- userRoutes.js         # Preferencias del usuario
|   |   |-- controllers/
|   |       |-- authController.js     # Registro con hash bcrypt + login con JWT
|   |       |-- Home/
|   |           |-- pageConfigController.js    # CRUD de secciones completas
|   |           |-- bloquePrincipalController.js  # Hero principal
|   |           |-- carruselController.js      # Carrusel de galeria
|   |           |-- serviciosController.js     # Servicios y diferenciales
|   |           |-- valoresController.js       # Mision, vision y valores
|   |           |-- disenoController.js        # Colores, fuentes y tema
|   |           |-- sobreNosotrosController.js # Sobre nosotros y pilares
|   |           |-- equipoController.js        # Equipo humano
|   |           |-- videoController.js         # Video institucional YouTube
|   |           |-- mapaController.js          # Mapa y ubicacion
|   |           |-- galeriaHogarController.js  # Galeria de fotos
|   |           |-- cuidadoBloqueController.js # Modulo cuidado dia
|   |           |-- exportController.js        # Exportacion a ZIP estatico
|   |           |-- homeConfigController.js    # Config general legacy
|
|-- frontend/                         # SPA con React + Vite
|   |-- index.html                    # HTML base con CDN de Bootstrap e iconos
|   |-- src/
|   |   |-- main.jsx                  # Entry point React con providers globales
|   |   |-- App.jsx                   # Definicion de todas las rutas
|   |   |-- index.css                 # Estilos globales y variables CSS del tema
|   |   |-- api/
|   |   |   |-- axios.js             # Instancia Axios con interceptor JWT
|   |   |-- context/
|   |   |   |-- AuthContext.jsx       # Estado global de autenticacion
|   |   |-- components/
|   |   |   |-- ProtectedRoute.jsx    # Wrapper que protege rutas admin
|   |   |   |-- ThemeProvider.jsx     # Aplica colores/fuentes dinamicamente
|   |   |-- pages/
|   |   |   |-- Home.jsx             # Pagina publica - renderiza secciones
|   |   |   |-- AdminPanel.jsx       # Panel de admin con tarjetas de modulos
|   |   |   |-- Welcome.jsx          # Landing page del CMS
|   |   |   |-- Login/
|   |   |   |   |-- Login.jsx        # Formulario de login
|   |   |   |   |-- Register.jsx     # Formulario de registro
|   |   |   |   |-- Auth.css         # Estilos de autenticacion
|   |   |   |-- ModulosEdicion/
|   |   |       |-- Home/
|   |   |           |-- Bloque1Config.jsx       # Editor del hero principal
|   |   |           |-- DisenoConfig.jsx        # Editor de colores y diseno
|   |   |           |-- ServiciosConfig.jsx     # Editor de servicios
|   |   |           |-- ValoresConfig.jsx       # Editor de valores
|   |   |           |-- SobreNosotrosConfig.jsx # Editor sobre nosotros
|   |   |           |-- EquipoConfig.jsx        # Editor equipo humano
|   |   |           |-- VideoConfig.jsx         # Editor video YouTube
|   |   |           |-- Carrusel.jsx            # Editor carrusel galeria
|   |   |           |-- MapaConfig.jsx          # Editor mapa ubicacion
|   |   |           |-- GaleriaHogarConfig.jsx  # Editor galeria de fotos
|   |   |           |-- CuidadoBloque.jsx       # Editor cuidado dia
|   |   |-- styles/
|   |       |-- home.css              # Estilos del hero y componentes Home
|
|-- tests/                            # Tests E2E con Playwright
|-- uploads/                          # Imagenes subidas por usuarios


3. TECNOLOGIAS UTILIZADAS
--------------------------

Backend:
  - Node.js + Express          -> API REST
  - MongoDB + Mongoose         -> Base de datos NoSQL
  - JWT (jsonwebtoken)         -> Autenticacion stateless
  - bcryptjs                   -> Hash de passwords
  - Multer                     -> Upload de imagenes
  - Archiver                   -> Generacion de ZIP para exportacion
  - CORS                       -> Acceso cross-origin
  - dotenv                     -> Variables de entorno

Frontend:
  - React 18 + Vite            -> SPA con hot reload
  - React Router DOM           -> Navegacion SPA
  - Axios                      -> Cliente HTTP con interceptores
  - Bootstrap 5.3.3 (CDN)     -> Framework CSS responsive
  - Bootstrap Icons (CDN)      -> Iconografia
  - Google Fonts (Poppins)     -> Tipografia base

Testing:
  - Playwright                 -> Tests end-to-end


4. FLUJO DE FUNCIONAMIENTO
---------------------------

   [Usuario]
      |
      v
   /register  -->  Se crea User + PageConfig con secciones default
      |
      v
   /login     -->  Se genera JWT, se guarda en localStorage
      |
      v
   /admin     -->  Panel con 10 modulos editables como tarjetas
      |
      v
   /Bloque1Config (o cualquier editor)
      |          El editor carga datos desde GET /api/home-config/{tipo}
      |          El usuario edita con vista previa en tiempo real
      |          Al guardar hace PUT /api/home-config/{tipo}
      v
   /Home       -->  Carga todas las secciones desde GET /api/home-config/page
      |              Las ordena por "order" y las renderiza dinamicamente
      |              ThemeProvider aplica colores y fuentes del tema
      v
   [Sitio publicado con el contenido del usuario]

   Flujo de exportacion:
   /admin  -->  Click "Exportar mi sitio"
      |         GET /api/home-config/export (con JWT)
      |         Backend genera HTML estatico + CSS + descarga imagenes
      |         Retorna ZIP listo para deploy
      v
   [mi-sitio.zip]  -->  Netlify / Vercel / GitHub Pages


5. MODELO DE DATOS
-------------------

Cada usuario tiene UN documento PageConfig que contiene un array de secciones:

   PageConfig {
     userId: ObjectId (ref User),
     sections: [
       {
         id: "bloquep-1",        // identificador unico
         type: "bloquep",        // tipo de seccion
         order: 0,               // posicion en la pagina
         config: { ... }         // configuracion flexible (Mixed)
       },
       {
         id: "servicios-1",
         type: "servicios",
         order: 1,
         config: { services: [...], highlights: [...] }
       },
       ...
     ]
   }

Tipos de seccion disponibles:
  bloquep, carrusel, servicios, valores, diseno, sobrenosotros,
  equipo, video, mapa, galeriahogar, cuidadod


6. INSTRUCCIONES DE INSTALACION Y EJECUCION
---------------------------------------------

Requisitos:
  - Node.js v18 o superior
  - MongoDB (local o Atlas)
  - npm

Paso 1: Clonar el repositorio
  git clone <url-del-repo>
  cd ProyectoU

Paso 2: Configurar variables de entorno
  Crear archivo backend/.env con:

    MONGO_URI=mongodb://localhost:27017/proyectoU
    JWT_SECRET=tu_clave_secreta_aqui
    PORT=4000

Paso 3: Instalar dependencias del backend
  cd backend
  npm install

Paso 4: Instalar dependencias del frontend
  cd ../frontend
  npm install

Paso 5: Ejecutar en desarrollo
  Terminal 1 (backend):
    cd backend
    npm run dev

  Terminal 2 (frontend):
    cd frontend
    npm run dev

Paso 6: Abrir en el navegador
  http://localhost:5173


7. DEPENDENCIAS PRINCIPALES
-----------------------------

Backend (backend/package.json):
  express, mongoose, jsonwebtoken, bcryptjs, multer, cors, dotenv, archiver

Frontend (frontend/package.json):
  react, react-dom, react-router-dom, axios, vite


8. API ENDPOINTS
-----------------

Autenticacion (publicos):
  POST  /api/auth/register       -> Registro de usuario
  POST  /api/auth/login          -> Login y obtencion de JWT

Modulos (GET publico, PUT autenticado):
  GET   /api/home-config/page       -> Todas las secciones del usuario
  PUT   /api/home-config/page       -> Actualizar secciones completas
  GET   /api/home-config/bloquep    -> Hero principal
  PUT   /api/home-config/bloquep    -> Actualizar hero
  GET   /api/home-config/servicios  -> Servicios
  PUT   /api/home-config/servicios  -> Actualizar servicios
  GET   /api/home-config/valores    -> Valores
  PUT   /api/home-config/valores    -> Actualizar valores
  GET   /api/home-config/diseno     -> Tema visual
  PUT   /api/home-config/diseno     -> Actualizar tema
  ... (mismo patron para todos los modulos)

Exportacion (autenticado):
  GET   /api/home-config/export     -> Descarga ZIP del sitio estatico

Upload (autenticado):
  POST  /api/upload                 -> Subir imagen (max 5MB, JPEG/PNG/WebP/GIF)

Usuario (autenticado):
  GET   /api/user/preferences       -> Obtener preferencias
  PATCH /api/user/preferences       -> Actualizar preferencias


9. PATRON DE LOS MODULOS
--------------------------

Todos los modulos siguen el mismo patron. Para agregar uno nuevo:

Backend:
  1. Crear controller en backend/src/controllers/Home/nuevoController.js
     - Definir TYPE, DEFAULT_CONFIG
     - Implementar getOrCreate(), getNuevo(), updateNuevo()
  2. Agregar rutas en homeConfigRoutes.js
     - GET con optionalAuth, PUT con verifyToken

Frontend:
  3. Crear componente en frontend/src/pages/ModulosEdicion/Home/NuevoConfig.jsx
     - useState para form, useEffect para cargar datos
     - Layout 2 columnas: editor (izq) + preview (der)
     - Boton guardar que hace PUT a la API
  4. Agregar ruta en App.jsx dentro de ProtectedRoute
  5. Agregar tarjeta en AdminPanel.jsx en el array modules[]


10. BUENAS PRACTICAS PARA MANTENIMIENTO
-----------------------------------------

  - Cada modulo es independiente: se puede editar sin afectar los demas.
    Si algo falla en un modulo, no tumba el resto del sistema.

  - Los controladores usan getOrCreate() para garantizar que siempre exista
    un documento PageConfig para el usuario, evitando errores de null.

  - El campo config es de tipo Mixed en Mongoose, lo que permite flexibilidad
    por modulo sin necesidad de migrar esquemas.

  - Siempre usar markModified("sections") antes de doc.save() cuando se
    modifica el array de secciones, porque Mongoose no detecta cambios
    en campos Mixed automaticamente.

  - Las imagenes se almacenan en /uploads con nombres unicos (timestamp + random).
    Se valida tipo MIME y tamano maximo de 5MB en el middleware de Multer.

  - El ThemeProvider aplica CSS variables en :root. Si se agrega un nuevo color
    o variable de diseno, hay que actualizar tanto disenoController como
    ThemeProvider y el CSS base.

  - Los tokens JWT expiran en 24h. Si se necesita mayor seguridad, reducir
    el tiempo y agregar refresh tokens.

  - Para produccion: cambiar JWT_SECRET, configurar HTTPS, limitar CORS
    a dominios especificos y considerar rate limiting en la API.

  - La exportacion descarga imagenes en paralelo con Promise.all.
    Si el sitio tiene muchas imagenes, el ZIP puede tardar unos segundos.

  - Git workflow: trabajamos en ramas feature/ y mergeamos a dev.
    Rama principal: main.


================================================================================
  Desarrollado como proyecto universitario - 2025
  Stack: React + Node.js + Express + MongoDB
================================================================================
