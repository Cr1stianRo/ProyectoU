/**
 * Funciones helper reutilizables para tests E2E
 */

/**
 * Intercepta peticiones a la API y responde con mock data
 * @param {Page} page - Página de Playwright
 * @param {string} endpoint - Endpoint de la API a interceptar
 * @param {object} mockResponse - Respuesta mock a devolver
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 */
export async function mockApiEndpoint(page, endpoint, mockResponse, method = 'GET') {
  await page.route(`**${endpoint}`, async (route) => {
    if (route.request().method() === method) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Intercepta peticiones a la API con error
 * @param {Page} page - Página de Playwright
 * @param {string} endpoint - Endpoint de la API a interceptar
 * @param {number} statusCode - Código de estado HTTP del error
 * @param {object} errorResponse - Respuesta de error
 */
export async function mockApiError(page, endpoint, statusCode = 500, errorResponse = {}) {
  await page.route(`**${endpoint}`, async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(errorResponse),
    });
  });
}

/**
 * Espera a que un elemento esté visible y listo para interactuar
 * @param {Page} page - Página de Playwright
 * @param {string} selector - Selector del elemento
 * @param {number} timeout - Timeout en milisegundos
 */
export async function waitForElement(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Rellena un formulario con múltiples campos
 * @param {Page} page - Página de Playwright
 * @param {object} fields - Objeto con selectores y valores
 */
export async function fillForm(page, fields) {
  for (const [selector, value] of Object.entries(fields)) {
    const element = page.locator(selector);
    await element.clear();
    await element.fill(value);
  }
}

/**
 * Maneja un diálogo de confirmación
 * @param {Page} page - Página de Playwright
 * @param {boolean} accept - Si aceptar o cancelar el diálogo
 * @param {string} expectedMessage - Mensaje esperado en el diálogo (opcional)
 */
export async function handleDialog(page, accept = true, expectedMessage = null) {
  page.once('dialog', async dialog => {
    if (expectedMessage) {
      expect(dialog.message()).toBe(expectedMessage);
    }
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
}

/**
 * Toma un screenshot con nombre descriptivo
 * @param {Page} page - Página de Playwright
 * @param {string} name - Nombre del screenshot
 */
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Verifica que múltiples elementos tengan los valores esperados
 * @param {Page} page - Página de Playwright
 * @param {object} expectations - Objeto con selectores y valores esperados
 */
export async function verifyFormValues(page, expectations) {
  for (const [selector, expectedValue] of Object.entries(expectations)) {
    const element = page.locator(selector);
    await expect(element).toHaveValue(expectedValue);
  }
}
