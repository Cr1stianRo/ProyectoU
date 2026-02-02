/**
 * Mock data para tests E2E
 * Centraliza todos los datos de prueba para fácil mantenimiento
 */

export const mockHomeConfig = {
  badgeText: 'Hogar geriátrico • Pereira',
  heroTitle: 'Bienvenidos a Nuestro Hogar',
  heroDescription: 'Un lugar cálido y seguro para nuestros adultos mayores',
  button2Text: 'Contactar por WhatsApp',
  whatsappNumber: '573001234567',
  pills: ['Fisioterapia • 2/sem', 'Alimentación balanceada', 'Atención médica 24/7']
};

export const mockApiResponses = {
  success: { success: true, message: 'Operación exitosa' },
  error: { success: false, message: 'Error en la operación' },
  serverError: { error: 'Error del servidor' },
};

export const mockUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'admin123',
  },
  user: {
    email: 'user@test.com',
    password: 'user123',
  },
};
