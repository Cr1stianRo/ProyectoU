import { test, expect } from '@playwright/test';
import { mockHomeConfig, mockApiResponses } from '../fixtures/mockData.js';
import { mockApiEndpoint, mockApiError } from '../utils/helpers.js';

/**
 * Feature Tests para el formulario de configuración del Bloque Principal
 *
 * Tipo: Feature Test (no E2E completo)
 * - Mockea respuestas de API
 * - Prueba funcionalidad específica del formulario
 * - No prueba flujos completos de usuario
 *
 * Casos cubiertos:
 * - Carga de datos desde API (mockeada)
 * - Edición de todos los campos del formulario
 * - Gestión de píldoras (añadir, editar, eliminar)
 * - Guardado de cambios
 * - Preview en tiempo real
 * - Manejo de errores
 */
test.describe('Bloque1Config - Formulario de Configuración', () => {
  const API_ENDPOINT = '/api/home-config/bloquep';

  test.beforeEach(async ({ page }) => {
    // Mock de la petición GET para cargar datos
    await mockApiEndpoint(page, API_ENDPOINT, mockHomeConfig, 'GET');

    // Navegar a la página del formulario
    await page.goto('/Bloque1Config');

    // Esperar a que el formulario cargue
    await page.waitForLoadState('networkidle');
  });

  test.describe('Carga de Datos', () => {
    test('debe cargar correctamente todos los datos desde la API', async ({ page }) => {
      // Verificar campos de texto
      await expect(page.locator('input[placeholder*="Hogar geriátrico"]').first())
        .toHaveValue(mockHomeConfig.badgeText);

      await expect(page.locator('label:has-text("Título principal")').locator('~ input').first())
        .toHaveValue(mockHomeConfig.heroTitle);

      await expect(page.locator('textarea'))
        .toHaveValue(mockHomeConfig.heroDescription);

      await expect(page.locator('label:has-text("Título botón 2")').locator('~ input'))
        .toHaveValue(mockHomeConfig.button2Text);

      await expect(page.locator('input[placeholder*="573005"]'))
        .toHaveValue(mockHomeConfig.whatsappNumber);

      // Verificar píldoras
      const pillInputs = page.locator('input[placeholder*="Fisioterapia"]');
      await expect(pillInputs).toHaveCount(mockHomeConfig.pills.length);
    });

    test('debe mostrar error cuando falla la carga de datos', async ({ page }) => {
      // Crear nueva página con mock de error
      const errorPage = await page.context().newPage();
      await mockApiError(errorPage, API_ENDPOINT, 500, mockApiResponses.serverError);
      await errorPage.goto('/Bloque1Config');

      // Verificar mensaje de error
      await expect(errorPage.locator('.alert-danger'))
        .toContainText('No se pudo cargar la configuración');

      await errorPage.close();
    });
  });

  test.describe('Edición de Campos', () => {
    test('debe permitir editar el subtítulo (badge)', async ({ page }) => {
      const badgeInput = page.locator('input[placeholder*="Hogar geriátrico"]').first();
      const newValue = 'Nuevo subtítulo';

      await badgeInput.clear();
      await badgeInput.fill(newValue);

      await expect(badgeInput).toHaveValue(newValue);
      await expect(page.locator('.badge.bg-light')).toContainText(newValue);
    });

    test('debe permitir editar el título principal', async ({ page }) => {
      const titleInput = page.locator('label:has-text("Título principal")').locator('~ input').first();
      const newValue = 'Nuevo Título Principal';

      await titleInput.clear();
      await titleInput.fill(newValue);

      await expect(titleInput).toHaveValue(newValue);
      await expect(page.locator('.hero-title')).toContainText(newValue);
    });

    test('debe permitir editar la descripción', async ({ page }) => {
      const textarea = page.locator('textarea');
      const newValue = 'Nueva descripción del hogar geriátrico con texto más largo';

      await textarea.clear();
      await textarea.fill(newValue);

      await expect(textarea).toHaveValue(newValue);
      await expect(page.locator('.lead')).toContainText(newValue);
    });

    test('debe permitir editar el texto del botón de WhatsApp', async ({ page }) => {
      const buttonInput = page.locator('label:has-text("Título botón 2")').locator('~ input');
      const newValue = 'Agenda tu Visita';

      await buttonInput.clear();
      await buttonInput.fill(newValue);

      await expect(buttonInput).toHaveValue(newValue);
      await expect(page.locator('.btn-whatsapp')).toContainText(newValue);
    });

    test('debe validar que el número de WhatsApp solo acepte dígitos', async ({ page }) => {
      const whatsappInput = page.locator('input[placeholder*="573005"]');

      await whatsappInput.clear();
      await whatsappInput.fill('573009876543');
      await expect(whatsappInput).toHaveValue('573009876543');

      // Intentar ingresar caracteres no numéricos
      await whatsappInput.clear();
      await whatsappInput.fill('573009876543abc!@#');

      // Debe mantener solo los números
      await expect(whatsappInput).toHaveValue('573009876543');
    });
  });

  test.describe('Gestión de Píldoras', () => {
    test('debe permitir añadir una nueva píldora', async ({ page }) => {
      const addButton = page.locator('button:has-text("+ Añadir")');
      const initialCount = await page.locator('input[placeholder*="Fisioterapia"]').count();

      await addButton.click();

      // Verificar que se añadió una nueva píldora
      await expect(page.locator('input[placeholder*="Fisioterapia"]'))
        .toHaveCount(initialCount + 1);

      // Llenar la nueva píldora
      const newPillInput = page.locator('input[placeholder*="Fisioterapia"]').last();
      await newPillInput.fill('Actividades recreativas');

      await expect(newPillInput).toHaveValue('Actividades recreativas');
      await expect(page.locator('.pill:has-text("Actividades recreativas")')).toBeVisible();
    });

    test('debe permitir eliminar una píldora', async ({ page }) => {
      const initialCount = await page.locator('input[placeholder*="Fisioterapia"]').count();
      const deleteButton = page.locator('button[aria-label="Eliminar pill"]').first();

      await deleteButton.click();

      // Verificar que se eliminó
      await expect(page.locator('input[placeholder*="Fisioterapia"]'))
        .toHaveCount(initialCount - 1);
    });

    test('debe permitir editar una píldora existente', async ({ page }) => {
      const firstPillInput = page.locator('input[placeholder*="Fisioterapia"]').first();
      const newValue = 'Terapia ocupacional • 3/sem';

      await firstPillInput.clear();
      await firstPillInput.fill(newValue);

      await expect(firstPillInput).toHaveValue(newValue);
      await expect(page.locator('.pill').first()).toContainText(newValue);
    });

    test('debe permitir añadir múltiples píldoras', async ({ page }) => {
      const addButton = page.locator('button:has-text("+ Añadir")');
      const pillsToAdd = ['Nueva píldora 1', 'Nueva píldora 2', 'Nueva píldora 3'];

      for (const pillText of pillsToAdd) {
        await addButton.click();
        const lastInput = page.locator('input[placeholder*="Fisioterapia"]').last();
        await lastInput.fill(pillText);
        await expect(lastInput).toHaveValue(pillText);
      }

      // Verificar que todas las píldoras están en el preview
      for (const pillText of pillsToAdd) {
        await expect(page.locator(`.pill:has-text("${pillText}")`)).toBeVisible();
      }
    });
  });

  test.describe('Guardado de Cambios', () => {
    test('debe guardar el formulario correctamente', async ({ page }) => {
      let savedData = null;

      // Interceptar petición PUT
      await page.route('**/api/home-config/bloquep', async (route) => {
        if (route.request().method() === 'PUT') {
          savedData = JSON.parse(route.request().postData());
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockApiResponses.success),
          });
        } else if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockHomeConfig),
          });
        }
      });

      await page.goto('/Bloque1Config');

      // Modificar campos
      await page.locator('input[placeholder*="Hogar geriátrico"]').first().fill('Badge actualizado');
      await page.locator('label:has-text("Título principal")').locator('~ input').first().fill('Título actualizado');

      // Manejar el diálogo de confirmación
      page.once('dialog', dialog => {
        expect(dialog.message()).toBe('Guardado ✅');
        dialog.accept();
      });

      // Guardar
      await page.locator('button:has-text("Guardar")').click();

      // Esperar a que se complete la petición
      await page.waitForTimeout(500);

      // Verificar datos guardados
      expect(savedData).toBeTruthy();
      expect(savedData.badgeText).toBe('Badge actualizado');
      expect(savedData.heroTitle).toBe('Título actualizado');
    });

    test('debe manejar error al guardar', async ({ page }) => {
      // Interceptar con error en PUT
      await page.route('**/api/home-config/bloquep', async (route) => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify(mockApiResponses.serverError),
          });
        } else if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockHomeConfig),
          });
        }
      });

      await page.goto('/Bloque1Config');

      // Manejar el diálogo de error
      page.once('dialog', dialog => {
        expect(dialog.message()).toBe('No se pudo guardar ❌');
        dialog.accept();
      });

      await page.locator('button:has-text("Guardar")').click();
    });
  });

  test.describe('Preview en Tiempo Real', () => {
    test('debe actualizar el preview al modificar todos los campos', async ({ page }) => {
      // Modificar todos los campos
      const changes = {
        badge: 'Test Badge',
        title: 'Test Title',
        description: 'Test Description',
        button: 'Test Button'
      };

      await page.locator('input[placeholder*="Hogar geriátrico"]').first().fill(changes.badge);
      await page.locator('label:has-text("Título principal")').locator('~ input').first().fill(changes.title);
      await page.locator('textarea').fill(changes.description);
      await page.locator('label:has-text("Título botón 2")').locator('~ input').fill(changes.button);

      // Verificar que el preview se actualiza
      await expect(page.locator('.badge.bg-light')).toContainText(changes.badge);
      await expect(page.locator('.hero-title')).toContainText(changes.title);
      await expect(page.locator('.lead')).toContainText(changes.description);
      await expect(page.locator('.btn-whatsapp')).toContainText(changes.button);
    });

    test('debe actualizar el preview de píldoras en tiempo real', async ({ page }) => {
      const firstPillInput = page.locator('input[placeholder*="Fisioterapia"]').first();
      const newPillValue = 'Preview Test Pill';

      await firstPillInput.clear();
      await firstPillInput.fill(newPillValue);

      // El preview debe mostrar el nuevo valor inmediatamente
      await expect(page.locator('.pill').first()).toContainText(newPillValue);
    });
  });
});
