// src/app/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { EncryptionService } from './encription.service';
import { TokenKeys } from '../enums/tokenKey.enum';
import { User, UserResponse } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService; // Declara el servicio aquí, pero no lo inyectes aún en el beforeEach principal
  let mockEncryptionService: jasmine.SpyObj<EncryptionService>;
  let localStorageStore: { [key: string]: string };

  // **IMPORTANTE: Asegúrate de que dummyUser coincida EXACTAMENTE con el objeto del error**
  const dummyUser: User = {
    id: '1', // <-- Confirmado como string
    fullname: 'Usuario de Prueba',
    username: 'prueba',
    email: 'prueba@ejemplo.com',
    password: 'asdfasdfsda', // Asegúrate de que esta propiedad exista en tu modelo User
  };
  const futureExpPayload = btoa(JSON.stringify({ exp: Math.floor(new Date('2030-01-01').getTime() / 1000) }));
  const dummyToken = `header.${futureExpPayload}.signature`;

  const pastExpPayload = btoa(JSON.stringify({ exp: Math.floor(new Date('2023-01-01').getTime() / 1000) }));
  const expiredToken = `header.${pastExpPayload}.signature`;

  const invalidBase64Token = 'header.invalid_base64_payload.signature';
  const noExpPayload = btoa(JSON.stringify({ user: 'test' }));
  const tokenWithoutExp = `header.${noExpPayload}.signature`;

  const userResponse: UserResponse = { user: dummyUser, token: dummyToken };

  let originalAtob: (encodedString: string) => string;

  beforeAll(() => {
    originalAtob = window.atob;
    spyOn(window, 'atob').and.callFake((b64encodedString: string) => {
      if (b64encodedString === futureExpPayload) {
        return `{"exp":${Math.floor(new Date('2030-01-01').getTime() / 1000)}}`;
      }
      if (b64encodedString === pastExpPayload) {
        return `{"exp":${Math.floor(new Date('2023-01-01').getTime() / 1000)}}`;
      }
      if (b64encodedString === 'invalid_base64_payload') {
        throw new Error('Caracteres no válidos para base64');
      }
      if (b64encodedString === noExpPayload) {
        return `{"user":"test"}`;
      }
      return originalAtob(b64encodedString);
    });
  });

  afterAll(() => {
    window.atob = originalAtob;
  });

  // Este beforeEach se encarga de configurar los mocks y el TestBed.
  // NO INYECTA EL SERVICIO AQUÍ TODAVÍA.
  beforeEach(() => {
    localStorageStore = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageStore[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => (localStorageStore[key] = value));
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageStore[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageStore = {};
    });

    mockEncryptionService = jasmine.createSpyObj('EncryptionService', ['getDecryptedItem', 'setEncryptedItem', 'removeEncryptedItem']);
    // Por defecto, getDecryptedItem devuelve null. Esto es para los tests que no necesitan un usuario al inicio.
    // Los tests del constructor lo anularán antes de inyectar el servicio.
    mockEncryptionService.getDecryptedItem.and.returnValue(null);
    mockEncryptionService.setEncryptedItem.and.stub();
    mockEncryptionService.removeEncryptedItem.and.stub();

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: EncryptionService, useValue: mockEncryptionService }],
    });
  });

  // ---

  // Nueva suite de pruebas específica para el constructor del AuthService.
  // Aquí es donde controlaremos el momento de la inyección.
  describe('constructor', () => {
    it('debería ser creado e inicializar el usuario desde localStorage si está presente', () => {
      // 1. Configuramos el mock de EncryptionService *antes* de inyectar el servicio.
      const encryptedUser = JSON.stringify(dummyUser);
      mockEncryptionService.getDecryptedItem.and.returnValue(encryptedUser);

      // 2. Inyectamos el AuthService. Su constructor se ejecutará *ahora*,
      // usando la configuración del mock que acabamos de hacer.
      service = TestBed.inject(AuthService);

      expect(service).toBeTruthy();
      expect(mockEncryptionService.getDecryptedItem).toHaveBeenCalledWith(TokenKeys.AUTH_USER);
      expect(service.currentUser).toEqual(dummyUser); // Esto debería pasar ahora
    });

    it('debería ser creado con el usuario en null si no hay usuario en localStorage', () => {
      // Configuramos el mock de EncryptionService para que devuelva null (esto ya es el valor por defecto,
      // pero es explícito aquí).
      mockEncryptionService.getDecryptedItem.and.returnValue(null);

      // Inyectamos el AuthService.
      service = TestBed.inject(AuthService);

      expect(service).toBeTruthy();
      expect(mockEncryptionService.getDecryptedItem).toHaveBeenCalledWith(TokenKeys.AUTH_USER);
      expect(service.currentUser).toBeNull();
    });
  });

  // ---

  // Para el resto de los métodos del servicio, podemos tener un `beforeEach`
  // que inyecte el servicio, ya que la inicialización del constructor
  // no es el foco de esas pruebas.
  describe('resto de los métodos', () => {
    beforeEach(() => {
      // Inyectamos el servicio para cada una de estas pruebas.
      // Su constructor se ejecutará con los mocks por defecto (getDecryptedItem devuelve null).
      service = TestBed.inject(AuthService);
    });

    // Test de user$ observable
    it('user$ debería emitir el usuario actual', (done) => {
      service.user$.subscribe((user) => {
        expect(user).toBeNull(); // Inicialmente null
        done();
      });
    });

    // Test de currentUser getter
    it('currentUser debería devolver el valor del usuario actual', () => {
      expect(service.currentUser).toBeNull();
      service.setUser(dummyUser);
      expect(service.currentUser).toEqual(dummyUser);
    });

    // Test de setDataUserLogged
    it('debería establecer los datos del usuario y el token al iniciar sesión', () => {
      service.setDataUserLogged(userResponse);
      expect(service.currentUser).toEqual(dummyUser);
      expect(localStorage.setItem).toHaveBeenCalledWith(TokenKeys.AUTH_TOKEN, dummyToken);
      expect(mockEncryptionService.setEncryptedItem).toHaveBeenCalledWith(TokenKeys.AUTH_USER, JSON.stringify(dummyUser));
    });

    // Test de setUser
    it('debería establecer el usuario y guardarlo encriptado', () => {
      service.setUser(dummyUser);
      expect(service.currentUser).toEqual(dummyUser);
      expect(mockEncryptionService.setEncryptedItem).toHaveBeenCalledWith(TokenKeys.AUTH_USER, JSON.stringify(dummyUser));
    });

    // Test de getToken
    describe('getToken', () => {
      it('debería recuperar el token de localStorage', () => {
        localStorage.setItem(TokenKeys.AUTH_TOKEN, dummyToken);
        expect(service.getToken()).toBe(dummyToken);
      });

      it('debería devolver null si no hay token en localStorage', () => {
        expect(service.getToken()).toBeNull();
      });
    });

    // Test de isAuthenticated
    describe('isAuthenticated', () => {
      it('debería devolver true para un token válido y no expirado', () => {
        localStorage.setItem(TokenKeys.AUTH_TOKEN, dummyToken);
        expect(service.isAuthenticated()).toBeTrue();
      });

      it('debería devolver false si no hay token presente', () => {
        localStorage.clear();
        expect(service.isAuthenticated()).toBeFalse();
      });

      it('debería devolver false para un token expirado', () => {
        localStorage.setItem(TokenKeys.AUTH_TOKEN, expiredToken);
        expect(service.isAuthenticated()).toBeFalse();
      });

      it('debería devolver false para un token con formato inválido (e.g., base64 mal formada)', () => {
        localStorage.setItem(TokenKeys.AUTH_TOKEN, invalidBase64Token);
        expect(service.isAuthenticated()).toBeFalse();
      });

      it('debería devolver false para un token con payload JSON válido pero sin la propiedad "exp"', () => {
        localStorage.setItem(TokenKeys.AUTH_TOKEN, tokenWithoutExp);
        expect(service.isAuthenticated()).toBeFalse();
      });
    });

    // Test de logout
    it('debería limpiar localStorage y establecer el usuario en null al cerrar sesión', () => {
      localStorage.setItem(TokenKeys.AUTH_TOKEN, dummyToken);
      service.setUser(dummyUser); // Simular un usuario loggeado
      expect(service.currentUser).toEqual(dummyUser);

      service.logout();

      expect(localStorage.clear).toHaveBeenCalledTimes(1);
      expect(service.currentUser).toBeNull();
    });
  });
});
