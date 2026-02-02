# 🧪 Testing en ProyectoU

## 📖 Tipos de Tests

### Feature Tests (Actuales)
**Ubicación:** `tests/feature/`

**Características:**
- ✅ Prueban funcionalidades específicas
- ✅ Mockean APIs para aislamiento
- ✅ Rápidos y confiables (~12s)
- ✅ Ideales para CI/CD

**Ejemplo:** Test del formulario Bloque1Config
- Mockea GET/PUT de API
- Prueba interacciones de UI
- Valida preview en tiempo real

### Future: E2E Tests (Recomendado)
**Ubicación:** `tests/e2e/` (cuando se implemente)

**Características:**
- 🔄 Flujos completos de usuario
- 🔄 Backend y BD reales
- 🔄 Sin mocks
- 🔄 Más lentos pero completos

**Ejemplo:** Test E2E completo
- Login → Navegación → Edición → Guardado → Verificación

## Estructura del Proyecto

```
ProyectoU/
├── backend/                      # Servidor Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── frontend/                     # Aplicación React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
│
└── tests/                        # ⭐ Suite de Tests Feature
    ├── feature/                      # Tests end-to-end
    │   └── bloque1-config.spec.js
    ├── fixtures/                 # Datos mock
    │   └── mockData.js
    ├── utils/                    # Funciones helper
    │   └── helpers.js
    ├── playwright.config.js      # Configuración
    ├── package.json              # Dependencias
    ├── .gitignore               # Exclusiones Git
    ├── .npmrc                   # Config NPM
    └── README.md                # Documentación
```

## ✨ Características de la Suite de Tests

### 🎯 Arquitectura Profesional

- **Separación de Responsabilidades:** Tests, fixtures y utilities en carpetas dedicadas
- **Reutilización de Código:** Mock data y helpers centralizados
- **Escalabilidad:** Fácil añadir nuevos tests y utilities
- **Mantenibilidad:** Código organizado y documentado

### 🔧 Configuración Avanzada

```javascript
// playwright.config.js
- Múltiples navegadores (Chromium, Firefox, WebKit)
- Auto-inicio del servidor de desarrollo
- Screenshots y videos en fallos
- Traces para debugging
- Timeouts configurables
- Workers paralelos
```

### 📦 Mock Data Centralizado

```javascript
// fixtures/mockData.js
export const mockHomeConfig = { /* ... */ }
export const mockApiResponses = { /* ... */ }
export const mockUsers = { /* ... */ }
```

### 🛠️ Funciones Helper Reutilizables

```javascript
// utils/helpers.js
- mockApiEndpoint()       // Mock de APIs
- mockApiError()          // Mock de errores
- waitForElement()        // Esperas inteligentes
- fillForm()              // Llenar formularios
- handleDialog()          // Manejar diálogos
- takeScreenshot()        // Screenshots
- verifyFormValues()      // Verificaciones
```

## 📊 Cobertura de Tests

### Bloque1Config - 15 Tests

#### 🔄 Carga de Datos (2)
- ✅ Carga correcta desde API
- ❌ Manejo de errores de carga

#### ✏️ Edición de Campos (5)
- Subtítulo (badge)
- Título principal
- Descripción
- Texto del botón WhatsApp
- Validación de número WhatsApp

#### 💊 Gestión de Píldoras (4)
- Añadir píldora
- Eliminar píldora
- Editar píldora
- Añadir múltiples píldoras

#### 💾 Guardado (2)
- Guardado exitoso
- Manejo de errores

#### 👁️ Preview (2)
- Preview de campos
- Preview de píldoras

## 🚀 Comandos Rápidos

### Desarrollo

```bash
# Desde la raíz del proyecto
cd tests

# Ejecutar todos los tests
npm test

# Ejecutar con UI (recomendado)
npm run test:ui

# Ejecutar viendo el navegador
npm run test:headed

# Debug
npm run test:debug
```

### CI/CD

```bash
# Ejecutar en modo CI
CI=true npm test

# Solo Chromium
npx playwright test --project=chromium

# Con reportes
npm test && npx playwright show-report
```

## 📈 Resultados Actuales

```
✅ 15/15 tests pasados (100%)
⏱️  Tiempo de ejecución: ~12 segundos
🌐 Navegador: Chromium
📊 Cobertura: Formulario Bloque1Config completo
```

## 🎓 Mejores Prácticas Implementadas

### ✅ Organización
- Estructura modular y escalable
- Separación clara de responsabilidades
- Documentación completa

### ✅ Código
- Mock data centralizado
- Helpers reutilizables
- Selectores semánticos
- Tests independientes

### ✅ Configuración
- Auto-inicio de servicios
- Screenshots en fallos
- Traces para debugging
- Reportes HTML interactivos

### ✅ Mantenibilidad
- Código limpio y comentado
- Tests organizados en grupos
- Nombres descriptivos
- README detallado

## 🔮 Próximos Pasos

### Tests Adicionales
- [ ] Tests de Login/Register
- [ ] Tests de otros módulos de edición
- [ ] Tests de navegación
- [ ] Tests de responsividad

### Mejoras
- [ ] Integración con CI/CD (GitHub Actions)
- [ ] Tests de performance
- [ ] Tests de accesibilidad
- [ ] Visual regression testing

### Infraestructura
- [ ] Docker para tests
- [ ] Paralelización en múltiples máquinas
- [ ] Reportes en la nube
- [ ] Integración con herramientas de QA

## 📚 Recursos

- **Documentación Playwright:** https://playwright.dev/
- **Best Practices:** https://playwright.dev/docs/best-practices
- **API Reference:** https://playwright.dev/docs/api/class-playwright

## 👥 Equipo

Para soporte o consultas sobre testing, contacta al equipo de desarrollo.

---

**Fecha:** 2026-02-01
**Versión:** 1.0.0
**Estado:** ✅ Producción
