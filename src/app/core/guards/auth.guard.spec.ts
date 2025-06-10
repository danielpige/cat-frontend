// src/app/services/encryption.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { EncryptionService } from '../services/encription.service';
import * as CryptoJS from 'crypto-js';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let localStorageStore: { [key: string]: string };

  const testKey = 'miClaveDePrueba';
  const testValue = 'Este es un valor de prueba secreto.';
  const secretKey = 'S3CR3TK3Y*';

  const hashedTestKey = CryptoJS.SHA256(testKey).toString();

  beforeEach(() => {
    localStorageStore = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageStore[key] || null);
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

  describe('encrypt', () => {
    it('debería encriptar un valor y ser desencriptable', () => {
      const encrypted = service.encrypt(testValue);
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(testValue);

      const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
      expect(decrypted).toBe(testValue);
    });
  });

  describe('decrypt', () => {
    it('debería desencriptar un valor encriptado correctamente', () => {
      const encrypted = service.encrypt(testValue);
      const decrypted = service.decrypt(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it('debería devolver una cadena vacía y NO registrar un error si el valor encriptado es una cadena inválida', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const invalidCiphertext = 'un_texto_cualquiera_sin_formato_cryptojs';
      const decrypted = service.decrypt(invalidCiphertext);

      expect(decrypted).toBe('');
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // Expectativa: NO se llama a console.error
    });

    it('debería devolver una cadena vacía y registrar un error para valor encriptado nulo', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const decryptedNull = service.decrypt(null as any);

      expect(decryptedNull).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalled(); // Expectativa: SÍ se llama a console.error
    });

    it('debería devolver una cadena vacía y registrar un error para valor encriptado indefinido', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const decryptedUndefined = service.decrypt(undefined as any);

      expect(decryptedUndefined).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalled(); // Expectativa: SÍ se llama a console.error
    });
  });

  describe('private hashKey', () => {
    it('debería generar un hash determinista SHA256 para una clave', () => {
      expect(hashedTestKey).toBe(CryptoJS.SHA256(testKey).toString());
    });
  });

  describe('setEncryptedItem', () => {
    it('debería encriptar el valor y almacenarlo en localStorage bajo una clave hasheada', () => {
      service.setEncryptedItem(testKey, testValue);

      expect(localStorage.setItem).toHaveBeenCalledWith(hashedTestKey, jasmine.any(String));

      const storedEncryptedValue = localStorageStore[hashedTestKey];
      expect(storedEncryptedValue).toBeTruthy();
      const decryptedStoredValue = service.decrypt(storedEncryptedValue);
      expect(decryptedStoredValue).toBe(testValue);
    });
  });

  describe('getDecryptedItem', () => {
    it('debería recuperar y desencriptar un valor de localStorage', () => {
      const encryptedValueToStore = service.encrypt(testValue);
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

    it('debería devolver una cadena vacía y NO registrar un error si el valor almacenado es una cadena inválida que no se puede desencriptar', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      localStorageStore[hashedTestKey] = 'valor_corrupto_no_encriptado';

      const retrievedValue = service.getDecryptedItem(testKey);

      expect(retrievedValue).toBe('');
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // Expectativa: NO se llama a console.error
    });
  });

  describe('removeEncryptedItem', () => {
    it('debería eliminar el elemento de localStorage por su clave hasheada', () => {
      localStorageStore[hashedTestKey] = 'algún_valor';

      service.removeEncryptedItem(testKey);

      expect(localStorage.removeItem).toHaveBeenCalledWith(hashedTestKey);
      expect(localStorageStore[hashedTestKey]).toBeUndefined();
    });
  });
});
