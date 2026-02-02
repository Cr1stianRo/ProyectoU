# 🧪 Suite de Tests Feature - ProyectoU

Suite completa de tests automatizados de funcionalidades usando Playwright para el proyecto ProyectoU.

## 🎯 Tipo de Tests

**Feature Tests** (Tests de Funcionalidad):
- ✅ Prueban funcionalidades específicas de la aplicación
- ✅ Mockean respuestas de API para aislamiento
- ✅ Rápidos y confiables
- ✅ Enfocados en componentes/módulos individuales

**Diferencia con E2E:**
- ❌ No prueban el flujo completo de usuario
- ❌ No usan el backend real
- ❌ No prueban integración completa

Los Feature Tests son ideales para desarrollo rápido y CI/CD. Para tests E2E completos (con backend real y flujos completos), se recomienda una suite separada.

## 📁 Estructura del Proyecto

```
tests/
├── feature/                          # Tests feature
│   └── bloque1-config.spec.js    # Tests del formulario Bloque1Config
├── fixtures/                     # Datos mock reutilizables
│   └── mockData.js              # Mock data centralizado
├── utils/                        # Funciones helper
│   └── helpers.js               # Helpers para tests
├── playwright.config.js          # Configuración de Playwright
├── package.json                  # Dependencias del proyecto
└── README.md                     # Esta documentación
```

## 🚀 Instalación

### 1. Instalar Dependencias

Desde la carpeta `tests/`:

```bash
npm install
```

### 2. Instalar Navegadores

Instalar los navegadores que Playwright necesita:

```bash
# Instalar solo Chromium (más rápido)
npx playwright install chromium

# O instalar todos los navegadores
npx playwright install
```

## 🎯 Ejecutar Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests (modo headless)
npm test

# Ejecutar con interfaz gráfica (recomendado para desarrollo)
npm run test:ui

# Ejecutar viendo el navegador
npm run test:headed

# Ejecutar en modo debug
npm run test:debug

# Ejecutar tests específicos
npx playwright test bloque1-config

# Ejecutar solo tests que fallaron
npx playwright test --last-failed
```

### Comandos Avanzados

```bash
# Ejecutar en un navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar tests con etiquetas específicas
npx playwright test --grep "Carga de Datos"

# Ejecutar tests en paralelo
npx playwright test --workers=4

# Generar código de test grabando interacciones
npx playwright codegen http://localhost:5173/Bloque1Config
```

## 📊 Reportes

### Ver Reporte HTML

Después de ejecutar los tests:

```bash
npx playwright show-report
```

El reporte incluye:
- ✅ Resultados de cada test
- 📸 Screenshots de fallos
- 🎬 Videos de ejecución
- 📝 Trazas detalladas
- ⏱️ Tiempos de ejecución

### Generar Reporte de Cobertura

```bash
# Ejecutar tests con trace completo
npx playwright test --trace on
```

## 🧩 Tests Disponibles

### Bloque1Config - Formulario de Configuración

**Ubicación:** `feature/bloque1-config.spec.js`
**Tipo:** Feature Test (mockea API)
**Casos de prueba:** 15 tests

#### 🔄 Carga de Datos (2 tests)
- ✅ Carga correcta de datos desde API
- ❌ Manejo de error al cargar datos

#### ✏️ Edición de Campos (5 tests)
- Editar subtítulo (badge)
- Editar título principal
- Editar descripción
- Editar texto del botón WhatsApp
- Validar número de WhatsApp (solo dígitos)

#### 💊 Gestión de Píldoras (4 tests)
- Añadir nueva píldora
- Eliminar píldora
- Editar píldora existente
- Añadir múltiples píldoras

#### 💾 Guardado de Cambios (2 tests)
- Guardar formulario correctamente
- Manejar error al guardar

#### 👁️ Preview en Tiempo Real (2 tests)
- Actualización del preview al modificar campos
- Actualización del preview de píldoras

## 🛠️ Configuración

### Playwright Config

El archivo `playwright.config.js` incluye:

- **Timeouts:** Configurados para desarrollo local
- **Navegadores:** Chromium, Firefox y WebKit
- **Screenshots:** Solo en fallos
- **Videos:** Solo en fallos
- **Traces:** En primer reintento
- **WebServer:** Inicia frontend automáticamente

### Variables de Entorno

Puedes crear un archivo `.env` en la carpeta `tests/`:

```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:4000
```

## 📝 Escribir Nuevos Tests

### 1. Usar Mock Data

Los datos mock están centralizados en `fixtures/mockData.js`:

```javascript
import { mockHomeConfig } from '../fixtures/mockData.js';

test('mi test', async ({ page }) => {
  // Usar mock data
  await mockApiEndpoint(page, '/api/endpoint', mockHomeConfig);
});
```

### 2. Usar Helpers

Las funciones helper están en `utils/helpers.js`:

```javascript
import { mockApiEndpoint, fillForm } from '../utils/helpers.js';

test('mi test', async ({ page }) => {
  // Mock de API
  await mockApiEndpoint(page, '/api/endpoint', mockData);

  // Llenar formulario
  await fillForm(page, {
    'input[name="name"]': 'Valor',
    'textarea': 'Descripción'
  });
});
```

### 3. Estructura de Test

```javascript
test.describe('Nombre del Módulo', () => {
  test.beforeEach(async ({ page }) => {
    // Setup antes de cada test
  });

  test.describe('Grupo de Tests', () => {
    test('debe hacer algo específico', async ({ page }) => {
      // Arrange: Preparar
      // Act: Actuar
      // Assert: Verificar
    });
  });
});
```

## 🔍 Debugging

### Debug con VS Code

Agrega esta configuración en `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Playwright Tests",
  "cwd": "${workspaceFolder}/tests",
  "runtimeExecutable": "npx",
  "runtimeArgs": ["playwright", "test", "--debug"]
}
```

### Debug con Inspector

```bash
# Abrir inspector de Playwright
npx playwright test --debug

# Debug de un test específico
npx playwright test bloque1-config --debug
```

### Trace Viewer

```bash
# Ver traces de tests fallidos
npx playwright show-trace trace.zip
```

## 🎨 Mejores Prácticas

### ✅ DO (Hacer)

- ✅ Usar selectores semánticos (roles, labels)
- ✅ Centralizar mock data en fixtures
- ✅ Usar helpers para código repetitivo
- ✅ Organizar tests en describe groups
- ✅ Escribir tests independientes
- ✅ Usar nombres descriptivos
- ✅ Verificar tanto UI como datos

### ❌ DON'T (No Hacer)

- ❌ Usar selectores frágiles (classes CSS específicas)
- ❌ Hardcodear datos en tests
- ❌ Tests que dependan de otros tests
- ❌ Esperas arbitrarias (usar waitFor)
- ❌ Tests muy largos (dividir en varios)

## 📚 Recursos

- [Documentación Playwright](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🐛 Troubleshooting

### Los tests fallan con timeout

Aumenta los timeouts en `playwright.config.js`:

```javascript
timeout: 60000,  // 60 segundos
```

### Navegador no se instala

```bash
# Reinstalar navegadores
npx playwright install --force
```

### Puerto ya en uso

Verifica que el frontend no esté corriendo en otro lugar:

```bash
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173
```

## 📞 Soporte

Para reportar issues o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización:** 2026-02-01
