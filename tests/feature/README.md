# 🎯 Feature Tests

## ¿Qué son los Feature Tests?

Los **Feature Tests** (o Component Tests) prueban funcionalidades específicas de la aplicación de forma aislada:

### Características:
- ✅ **Aislamiento:** Mockean APIs y dependencias externas
- ✅ **Velocidad:** Más rápidos que E2E completos
- ✅ **Confiabilidad:** No dependen de servicios externos
- ✅ **Mantenibilidad:** Fáciles de actualizar

### Cuándo usar Feature Tests:
- Probar un formulario específico
- Validar interacciones de UI
- Verificar estados y transiciones
- Pruebas de regresión rápidas

### Cuándo NO usar Feature Tests:
- Flujos completos de usuario (Login → Navegación → Acción)
- Integración real con backend
- Pruebas de performance real
- Validación de datos persistidos

## 📁 Tests Actuales

### bloque1-config.spec.js
**Funcionalidad:** Formulario de configuración del Bloque Principal

**Cobertura:**
- Carga de datos (mock)
- Edición de campos
- Gestión de píldoras dinámicas
- Guardado (mock)
- Preview en tiempo real
- Manejo de errores

**API Mockeada:**
- `GET /api/home-config/bloquep`
- `PUT /api/home-config/bloquep`

## 🚀 Agregar Nuevos Feature Tests

### 1. Crear archivo en `feature/`

```javascript
// feature/nuevo-modulo.spec.js
import { test, expect } from '@playwright/test';
import { mockApiEndpoint } from '../utils/helpers.js';

test.describe('Nuevo Módulo', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiEndpoint(page, '/api/endpoint', mockData);
    await page.goto('/ruta');
  });

  test('debe hacer algo', async ({ page }) => {
    // Arrange, Act, Assert
  });
});
```

### 2. Agregar mock data en `fixtures/`

```javascript
// fixtures/mockData.js
export const mockNuevoModulo = {
  // datos de prueba
};
```

### 3. Ejecutar tests

```bash
npm test
```

## 🎓 Mejores Prácticas

### ✅ DO
- Mockear todas las APIs
- Probar casos happy path y error
- Usar selectores semánticos
- Tests independientes
- Nombres descriptivos

### ❌ DON'T
- Depender de orden de ejecución
- Hardcodear datos
- Tests muy largos
- Esperas arbitrarias
- Selectores frágiles

## 📊 Estructura de un Feature Test

```javascript
test.describe('Nombre del Feature', () => {
  // Setup común
  test.beforeEach(async ({ page }) => {
    // Mock de APIs
    // Navegación inicial
    // Estado inicial
  });

  // Agrupar por funcionalidad
  test.describe('Grupo 1', () => {
    test('caso específico 1', async ({ page }) => {
      // Arrange: preparar
      // Act: ejecutar acción
      // Assert: verificar resultado
    });
  });

  test.describe('Grupo 2', () => {
    // más tests...
  });
});
```

## 🔄 Migración a E2E

Si necesitas convertir un Feature Test a E2E:

1. Remover mocks de API
2. Asegurar que backend esté corriendo
3. Agregar setup de base de datos
4. Agregar cleanup después de tests
5. Mover a carpeta `e2e/` (cuando exista)

## 📚 Recursos

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Isolation](https://playwright.dev/docs/test-isolation)
- [Mocking](https://playwright.dev/docs/mock)
