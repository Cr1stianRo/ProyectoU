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
|   |   |   |-- AuthContext.jsx       # Estado global de autenticacion (incluye flag loggingOut)
|   |   |-- components/
|   |   |   |-- ProtectedRoute.jsx    # Wrapper que protege rutas admin (respeta loggingOut)
|   |   |   |-- ThemeProvider.jsx     # Aplica colores/fuentes dinamicamente (solo en /Home)
|   |   |-- pages/
|   |   |   |-- Home.jsx             # Pagina publica - renderiza secciones dinamicamente
|   |   |   |-- AdminPanel.jsx       # Panel de admin con tarjetas de modulos
|   |   |   |-- Welcome.jsx          # Landing page inmersiva del CMS
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
  - Node.js + Express 5.2.1     -> API REST
  - MongoDB + Mongoose 9.0.0    -> Base de datos NoSQL
  - JWT (jsonwebtoken 9.0.2)    -> Autenticacion stateless
  - bcrypt 6.0.0                -> Hash de passwords
  - Multer 2.0.2                -> Upload de imagenes
  - Archiver 7.0.1              -> Generacion de ZIP para exportacion
  - CORS 2.8.5                  -> Acceso cross-origin
  - dotenv                      -> Variables de entorno

Frontend:
  - React 19.2.3 + Vite 7.3.1  -> SPA con hot reload
  - React Router DOM 7.12.0     -> Navegacion SPA
  - Axios 1.13.2                -> Cliente HTTP con interceptores
  - Bootstrap 5.3.3 (CDN)       -> Framework CSS responsive
  - Bootstrap Icons (CDN)        -> Iconografia
  - Google Fonts (Poppins)       -> Tipografia base

Testing:
  - Playwright                   -> Tests end-to-end


4. FLUJO DE FUNCIONAMIENTO
---------------------------

   [Usuario]
      |
      v
   /  (Welcome)  -->  Pantalla de bienvenida inmersiva con animaciones
      |                Botones: "Iniciar Sesion" -> /login
      |                          "Crear Cuenta"  -> /register
      v
   /register  -->  Se crea User + PageConfig con secciones default
      |
      v
   /login     -->  Se genera JWT, se guarda en localStorage
      |            Se restaura la ultima ruta visitada (o /admin por defecto)
      v
   /admin     -->  Panel con 10 modulos editables como tarjetas
      |            Boton "Volver al sitio" -> /Home (plantilla del usuario)
      |            Boton "Cerrar sesion"   -> / (pantalla de bienvenida)
      v
   /Bloque1Config (o cualquier editor)
      |          El editor carga datos desde GET /api/home-config/{tipo}
      |          El usuario edita con vista previa en tiempo real
      |          Al guardar hace PUT /api/home-config/{tipo}
      v
   /Home       -->  Carga todas las secciones desde GET /api/home-config/page
      |              Las ordena por "order" y las renderiza dinamicamente
      |              ThemeProvider aplica colores y fuentes del tema
      |              Pie de pagina con CTA de WhatsApp y texto de invitacion
      v
   [Sitio publicado con el contenido del usuario]

   Flujo de exportacion:
   /admin  -->  Click "Exportar mi sitio"
      |         GET /api/home-config/export (con JWT)
      |         Backend genera HTML estatico + CSS + descarga imagenes
      |         Retorna ZIP listo para deploy
      v
   [mi-sitio.zip]  -->  Netlify / Vercel / GitHub Pages


5. SISTEMA DE RUTAS
--------------------

Rutas publicas (acceso libre, sin autenticacion):
  /              ->  Welcome.jsx    Pantalla de bienvenida (landing page)
  /Home          ->  Home.jsx       Sitio publico del usuario (plantilla)
  /welcome       ->  Welcome.jsx    Alias de /
  /login         ->  Login.jsx      Formulario de inicio de sesion
  /register      ->  Register.jsx   Formulario de registro

Rutas protegidas (requieren JWT, redirigen a /login si no hay sesion):
  /admin              ->  AdminPanel.jsx         Panel de administracion
  /Bloque1Config      ->  Bloque1Config.jsx      Editor hero principal
  /ServiciosConfig    ->  ServiciosConfig.jsx     Editor servicios
  /Carrusel           ->  Carrusel.jsx           Editor carrusel
  /MapaConfig         ->  MapaConfig.jsx         Editor mapa
  /ValoresConfig      ->  ValoresConfig.jsx      Editor valores
  /GaleriaHogarConfig ->  GaleriaHogarConfig.jsx Editor galeria
  /DisenoConfig       ->  DisenoConfig.jsx       Editor diseno visual
  /SobreNosotrosConfig -> SobreNosotrosConfig.jsx Editor sobre nosotros
  /EquipoConfig       ->  EquipoConfig.jsx       Editor equipo
  /VideoConfig        ->  VideoConfig.jsx        Editor video

Comportamiento de navegacion:
  - "Volver al sitio" en AdminPanel  -> navega a /Home (plantilla del usuario)
  - "Cerrar sesion" en AdminPanel    -> navega a / (Welcome)
  - Acceso directo a ruta protegida sin sesion -> redirige a /login
  - ProtectedRoute usa flag loggingOut del AuthContext para distinguir
    entre cierre de sesion (redirige a /) y acceso no autorizado (redirige
    a /login)


6. MODELO DE DATOS
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


7. INSTRUCCIONES DE INSTALACION Y EJECUCION
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


8. DEPENDENCIAS PRINCIPALES
-----------------------------

Backend (backend/package.json):
  express 5.2.1, mongoose 9.0.0, jsonwebtoken 9.0.2, bcrypt 6.0.0,
  multer 2.0.2, cors 2.8.5, dotenv, archiver 7.0.1

Frontend (frontend/package.json):
  react 19.2.3, react-dom 19.2.3, react-router-dom 7.12.0,
  axios 1.13.2, vite 7.3.1


9. API ENDPOINTS
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
  GET   /api/home-config/sobrenosotros -> Sobre nosotros
  PUT   /api/home-config/sobrenosotros -> Actualizar sobre nosotros
  GET   /api/home-config/equipo     -> Equipo humano
  PUT   /api/home-config/equipo     -> Actualizar equipo
  GET   /api/home-config/video      -> Video institucional
  PUT   /api/home-config/video      -> Actualizar video
  GET   /api/home-config/mapa       -> Mapa y ubicacion
  PUT   /api/home-config/mapa       -> Actualizar mapa
  GET   /api/home-config/galeriahogar -> Galeria de fotos
  PUT   /api/home-config/galeriahogar -> Actualizar galeria
  GET   /api/home-config/carrusel   -> Carrusel de imagenes
  PUT   /api/home-config/carrusel   -> Actualizar carrusel
  GET   /api/home-config/cuidadod   -> Bloque cuidado dia
  PUT   /api/home-config/cuidadod   -> Actualizar cuidado dia

Exportacion (autenticado):
  GET   /api/home-config/export     -> Descarga ZIP del sitio estatico

Upload (autenticado):
  POST  /api/upload                 -> Subir imagen (max 5MB, JPEG/PNG/WebP/GIF)

Usuario (autenticado):
  GET   /api/user/preferences       -> Obtener preferencias
  PUT   /api/user/preferences       -> Actualizar preferencias


10. PATRON DE LOS MODULOS
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
     - Placeholders con textos guia ("Aqui puedes escribir...")
  4. Agregar ruta en App.jsx dentro de ProtectedRoute
  5. Agregar tarjeta en AdminPanel.jsx en el array modules[]


11. SISTEMA DE AUTENTICACION Y LOGOUT
---------------------------------------

El sistema usa JWT (JSON Web Tokens) para autenticacion stateless.

Flujo de login:
  1. Usuario envia email + password a POST /api/auth/login
  2. Backend valida credenciales con bcrypt
  3. Si es valido, genera un JWT con expiracion de 7 dias
  4. Frontend guarda token y user en localStorage via AuthContext
  5. Axios interceptor adjunta el token en cada peticion saliente

Flujo de logout:
  1. Usuario hace clic en "Cerrar sesion" en AdminPanel
  2. Se ejecuta logout() del AuthContext:
     - Se activa el flag loggingOut = true
     - Se borran user y token de estado y localStorage
  3. ProtectedRoute detecta !isAuthenticated + loggingOut:
     - Redirige a / (Welcome) en lugar de /login
  4. El flag loggingOut se resetea al hacer login nuevamente

Proteccion de rutas:
  - ProtectedRoute envuelve todas las rutas de administracion
  - Si !isAuthenticated y NO es logout -> redirige a /login
  - Si !isAuthenticated y SI es logout -> redirige a /
  - ProtectedRoute guarda la ultima ruta visitada en las preferencias
    del usuario para restaurarla en el proximo login


12. PANTALLA DE BIENVENIDA (Welcome.jsx)
------------------------------------------

La pantalla de bienvenida es una landing page inmersiva con:

  - Hero full-screen con fondo animado (gradiente calido cafe/arena)
  - Particulas flotantes con animacion CSS
  - Orbes decorativos con blur y animacion de deriva
  - Malla de fondo con efecto de pulso
  - Animaciones escalonadas de entrada (fade up)
  - Icono principal con borde giratorio (conic-gradient)
  - Badge "Plataforma activa" con indicador LED verde pulsante
  - Titulo gigante con gradiente dorado en palabras clave
  - Botones: "Iniciar Sesion" (solido) y "Crear Cuenta Gratis" (glass)
  - Indicador de scroll animado

  - Seccion de funcionalidades con 6 tarjetas interactivas:
    Diseno personalizado, Modulos arrastrables, Exporta tu sitio,
    100% responsive, Galeria y carrusel, Panel seguro

  - Barra de estadisticas: 10+ modulos, 0 lineas de codigo,
    100% personalizable, 1 clic para exportar

  - CTA final con caja oscura y boton "Crear mi cuenta ahora"
  - Footer con copyright y ano dinamico

  Paleta de colores: #1a0f08, #3d2b1f, #5b4636, #8C6A4A, #b8956a,
  #e8c9a6, #f5e6d3 (coherente con todo el proyecto)


13. PIE DE PAGINA CON CTA DE WHATSAPP (Home.jsx)
--------------------------------------------------

Al final de la pagina publica, si el usuario configuro un numero de
WhatsApp, se muestra una seccion CTA con fondo cafe que incluye:

  - Titulo predeterminado: "Estamos para ayudarte"
    (el usuario puede personalizarlo via ctaTitle en bloquep)
  - Texto de invitacion: "Contactanos y con gusto resolveremos todas
    tus dudas. Tu familia merece la mejor atencion."
    (personalizable via ctaDescription en bloquep)
  - Boton de WhatsApp con enlace directo y mensaje pre-rellenado

Estos textos son fallbacks amables que aparecen cuando el usuario no
ha configurado textos propios para el CTA. Si los personaliza, se
muestran los del usuario.


14. BUENAS PRACTICAS PARA MANTENIMIENTO
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

  - El ThemeProvider aplica CSS variables en :root solo en la ruta /Home.
    En las demas rutas se usan los estilos por defecto del admin.
    Si se agrega un nuevo color o variable de diseno, hay que actualizar
    tanto disenoController como ThemeProvider y el CSS base.

  - Los tokens JWT expiran en 7 dias. Si se necesita mayor seguridad,
    reducir el tiempo y agregar refresh tokens.

  - Para produccion: cambiar JWT_SECRET, configurar HTTPS, limitar CORS
    a dominios especificos y considerar rate limiting en la API.

  - La exportacion descarga imagenes en paralelo con Promise.all.
    Si el sitio tiene muchas imagenes, el ZIP puede tardar unos segundos.

  - Git workflow: trabajamos en ramas feature/ y mergeamos a dev.
    Rama principal: main.

  - Los campos de texto en los editores usan placeholders como textos
    guia ("Aqui puedes escribir...", "Describe en que consiste...").
    Los DEFAULT_CONFIG del backend usan cadenas vacias "".
    No se impone contenido por defecto al usuario.


================================================================================
  Desarrollado como proyecto universitario - 2025
  Stack: React 19 + Node.js + Express 5 + MongoDB
================================================================================
