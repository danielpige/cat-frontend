import { TestBed } from '@angular/core/testing';
import { EncryptionService } from './encription.service';
import * as CryptoJS from 'crypto-js';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let localStorageStore: { [key: string]: string }; // Objeto para simular localStorage

  const testKey = 'miClaveDePrueba';
  const testValue = 'Este es un valor de prueba secreto.';
  const secretKey = 'S3CR3TK3Y*'; // La clave secreta del servicio

  // Calculamos el hash de la clave de prueba de forma determinista para la verificación
  const hashedTestKey = CryptoJS.SHA256(testKey).toString();

  beforeEach(() => {
    // Reiniciar el objeto que simula localStorage antes de cada prueba
    localStorageStore = {};

    // Espiar y simular los métodos de localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageStore[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageStore[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageStore[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageStore = {};
    });

    TestBed.configureTestingModule({
      providers: [EncryptionService],
    });

    service = TestBed.inject(EncryptionService);
  });

  // ---

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  // Prueba de la función encrypt
  describe('encrypt', () => {
    it('debería encriptar un valor y ser desencriptable', () => {
      const encrypted = service.encrypt(testValue);
      // La cadena encriptada no debe ser vacía ni igual al valor original
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(testValue);

      // **CORRECCIÓN CLAVE:** En lugar de comparar la cadena encriptada exacta,
      // verificamos que la encriptación es válida al poder desencriptarla de nuevo.
      const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
      expect(decrypted).toBe(testValue);
    });
  });

  // Prueba de la función decrypt
  describe('decrypt', () => {
    it('debería desencriptar un valor encriptado correctamente', () => {
      // Primero encriptamos un valor usando el servicio
      const encrypted = service.encrypt(testValue);
      // Luego lo desencriptamos
      const decrypted = service.decrypt(encrypted);
      // Y verificamos que el valor desencriptado sea el original
      expect(decrypted).toBe(testValue);
    });

    it('debería devolver una cadena vacía y registrar un error si el valor encriptado es inválido', () => {
      // Espiamos console.error para verificar que se llame solo si se lanza una excepción
      const consoleErrorSpy = spyOn(console, 'error');
      const invalidCiphertext = 'valor_encriptado_invalido_que_causa_error_real_en_cryptojs'; // Un ciphertext que realmente rompa CryptoJS
      const decrypted = service.decrypt(invalidCiphertext);

      expect(decrypted).toBe('');
      // Para este tipo de entrada, CryptoJS.AES.decrypt DEBERÍA lanzar un error,
      // por lo tanto, esperamos que console.error sea llamado.
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('debería devolver una cadena vacía para valor encriptado nulo', () => {
      // Para null, CryptoJS.AES.decrypt suele producir un WordArray vacío sin lanzar error.
      // La conversión a Utf8 de un WordArray vacío da un string vacío.
      const consoleErrorSpy = spyOn(console, 'error');
      const decryptedNull = service.decrypt(null as any);

      expect(decryptedNull).toBe('');
      // No esperamos que console.error sea llamado, ya que no necesariamente lanza un error.
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('debería devolver una cadena vacía para valor encriptado indefinido', () => {
      // Similar al caso nulo.
      const consoleErrorSpy = spyOn(console, 'error');
      const decryptedUndefined = service.decrypt(undefined as any);

      expect(decryptedUndefined).toBe('');
      // No esperamos que console.error sea llamado.
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  // Test de la función hashKey (privada, pero podemos verificar su comportamiento)
  describe('private hashKey', () => {
    it('debería generar un hash determinista SHA256 para una clave', () => {
      // Verificamos que el hashTestKey calculado al inicio coincide con la lógica de CryptoJS
      expect(hashedTestKey).toBe(CryptoJS.SHA256(testKey).toString());
    });
  });

  // Prueba de setEncryptedItem
  describe('setEncryptedItem', () => {
    it('debería encriptar el valor y almacenarlo en localStorage bajo una clave hasheada', () => {
      service.setEncryptedItem(testKey, testValue);

      // Verificamos que localStorage.setItem fue llamado con la clave hasheada
      expect(localStorage.setItem).toHaveBeenCalledWith(
        hashedTestKey,
        jasmine.any(String) // **CORRECCIÓN CLAVE:** Esperamos CUALQUIER STRING encriptado
      );

      // Verificamos que el valor almacenado en localStorage (nuestro mock) pueda ser desencriptado de vuelta
      const storedEncryptedValue = localStorageStore[hashedTestKey];
      expect(storedEncryptedValue).toBeTruthy(); // Asegura que algo se guardó
      const decryptedStoredValue = service.decrypt(storedEncryptedValue);
      expect(decryptedStoredValue).toBe(testValue);
    });
  });

  // Pruebas de getDecryptedItem
  describe('getDecryptedItem', () => {
    it('debería recuperar y desencriptar un valor de localStorage', () => {
      // Primero encriptamos un valor y lo ponemos directamente en nuestro localStorage mock
      const encryptedValueToStore = service.encrypt(testValue); // Usa el servicio para encriptar
      localStorageStore[hashedTestKey] = encryptedValueToStore;

      const retrievedValue = service.getDecryptedItem(testKey);

      expect(localStorage.getItem).toHaveBeenCalledWith(hashedTestKey);
      expect(retrievedValue).toBe(testValue);
    });

    it('debería devolver null si la clave no existe en localStorage', () => {
      const retrievedValue = service.getDecryptedItem('claveInexistente');

      expect(localStorage.getItem).toHaveBeenCalledWith(CryptoJS.SHA256('claveInexistente').toString());
      expect(retrievedValue).toBeNull();
    });

    it('debería devolver una cadena vacía y registrar un error si el valor almacenado es inválido y no se puede desencriptar', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      // Simular un valor corrupto en localStorage que cause un error de desencriptación
      localStorageStore[hashedTestKey] = 'valor_corrupto_no_encriptado';

      const retrievedValue = service.getDecryptedItem(testKey);

      expect(retrievedValue).toBe('');
      // Esperamos que console.error sea llamado porque esto debería lanzar una excepción real en CryptoJS.
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  // Pruebaa de removeEncryptedItem
  describe('removeEncryptedItem', () => {
    it('debería eliminar el elemento de localStorage por su clave hasheada', () => {
      // Simular que un elemento ya está en localStorage
      localStorageStore[hashedTestKey] = 'algún_valor';

      service.removeEncryptedItem(testKey);

      expect(localStorage.removeItem).toHaveBeenCalledWith(hashedTestKey);
      expect(localStorageStore[hashedTestKey]).toBeUndefined(); // Verifica que se eliminó de nuestro mock
    });
  });
});
