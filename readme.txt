========================================
PROYECTO  – DOCUMENTACIÓN GENERAL
========================================

Proyecto full-stack con frontend y backend separados, usando Git y GitHub
con un flujo de trabajo por ramas (main / dev / feature).

----------------------------------------
1. ESTRUCTURA DEL PROYECTO
----------------------------------------

ProyectoU/
├─ frontend/   → React + Vite
└─ backend/    → Node.js + Express + MongoDB

Frontend y backend se ejecutan por separado.

----------------------------------------
2. TECNOLOGÍAS
----------------------------------------

BACKEND
- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors
- ES Modules

FRONTEND
- React
- Vite
- Axios
- React Router DOM

----------------------------------------
3. RAMAS DEL PROYECTO (MUY IMPORTANTE)
----------------------------------------

main
- Rama estable
- Lo que funciona y se puede presentar
- NO se trabaja directamente aquí

dev
- Rama de desarrollo
- Aquí se integran los cambios antes de pasar a main

feature/*
- Ramas de trabajo individuales
- Ejemplos:
  - feature/cristian
  - feature/rodas

Regla principal:
feature → dev → main

los cambios de feature se pasan a dev, y de dev a main. 
main: producción
dev: desarrollo
feature/*: Es donde trabaja cada uno.

----------------------------------------
4. CLONAR EL PROYECTO
----------------------------------------

Clonar el repositorio:

git clone https://github.com/Cr1stianRo/ProyectoU.git
cd ProyectoU

Por defecto quedas en main.

Si vas a desarrollar:

git checkout dev
git checkout -b feature/rodas

----------------------------------------
5. EJECUTAR EL BACKEND
----------------------------------------

1. Entrar a la carpeta backend:
cd backend

2. Instalar dependencias:
npm install

3. Crear archivo .env con el contenido:

MONGO_URI=mongodb://localhost:27017/dreamsdb
JWT_SECRET=mi_secreto_super_seguro
PORT=4000

4. Ejecutar el servidor:
node src/server.js

Backend disponible en:
http://localhost:4000

----------------------------------------
6. EJECUTAR EL FRONTEND
----------------------------------------

1. Entrar a la carpeta frontend:
cd frontend

2. Instalar dependencias:
npm install

3. Ejecutar el proyecto:
npm run dev

Frontend disponible en:
http://localhost:5173

----------------------------------------
7. AUTENTICACIÓN (RESUMEN)
----------------------------------------

- Registro: POST /api/auth/register
- Login: POST /api/auth/login



----------------------------------------
8. HOME TIPO CMS
----------------------------------------

El Home es editable desde un panel de configuración
y los datos se guardan en MongoDB.

Endpoints:
GET  /api/home-config/bloquep
PUT  /api/home-config/bloquep

Campos principales:
- badgeText
- heroTitle
- heroDescription
- button2Text
- whatsappNumber
- pills

El Home real consume estos datos desde el backend.

----------------------------------------
9. FLUJO DE TRABAJO CON GIT
----------------------------------------

TRABAJO DIARIO (EN FEATURE):

git checkout feature/rodas
git add .
git commit -m "mensaje claro"
git push

PASAR CAMBIOS A DEV:

git checkout dev
git pull origin dev
git merge feature/tu-nombre
git push origin dev

PASAR DEV A MAIN (Esto se hace coordinando conmigo, pa que no nos tiremos el main jsjs):
- Se hace mediante Pull Request en GitHub
- base: main
- compare: dev

----------------------------------------
10. NOTAS IMPORTANTES
----------------------------------------

- Un merge local NO sube cambios a GitHub
  → siempre hacer git push
- Los mensajes "ahead / behind" se comparan
  con la rama indicada (main o dev)
- Las ramas feature se alinean con dev, no con main
- main solo recibe cambios desde dev

----------------------------------------
11. REGLA MENTAL FINAL
----------------------------------------

feature → dev → main

feature = trabajo individual
dev     = integración
main    = estable / producción

----------------------------------------
FIN DEL README
----------------------------------------
