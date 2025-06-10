import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs'; // Necesario para el último test
import { AuthInterceptor } from './auth.interceptor';
import { TokenKeys } from '../enums/tokenKey.enum'; // Asegúrate de que esta ruta sea correcta
import { environment } from '../../../environments/environment'; // Asegúrate de que esta ruta sea correcta

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const dummyToken = 'miTokenDePrueba123';
  const apiUrl = environment.apiUrl; // Obtenemos la URL de la API del entorno

  beforeEach(() => {
    // Limpiamos localStorage antes de cada prueba para asegurar un estado limpio
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // HttpClientTestingModule es crucial para simular peticiones HTTP
      providers: [
        // Aquí le decimos a Angular que use nuestro AuthInterceptor
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true, // Importante: Permite que se proporcionen múltiples interceptores
        },
      ],
    });

    // Inyectamos HttpClient y HttpTestingController del entorno de pruebas
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // Verificamos que no queden peticiones HTTP pendientes al final de cada prueba
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    // Verificamos que el interceptor puede ser instanciado correctamente
    // Accedemos a la instancia del interceptor a través del token HTTP_INTERCEPTORS
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS)[0] as AuthInterceptor;
    expect(interceptor).toBeTruthy();
  });

  // Escenario 1: Hay un token y la petición es a la API (debe añadir el encabezado)
  describe('cuando hay un token y la petición es a la API', () => {
    beforeEach(() => {
      // Configuramos el localStorage con un token de prueba
      localStorage.setItem(TokenKeys.AUTH_TOKEN, dummyToken);
    });

    it('debería añadir un encabezado de Autorización', () => {
      // Realizamos una petición HTTP simulada a la URL de nuestra API
      httpClient.get(`${apiUrl}/data`).subscribe();

      // Esperamos que haya exactamente una petición a la URL correcta y la "capturamos"
      const req = httpTestingController.expectOne(`${apiUrl}/data`);

      // Verificamos que el encabezado 'Authorization' fue añadido
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      // Verificamos que el valor del encabezado sea el correcto (Bearer + token)
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);

      // Resolvemos la petición con una respuesta vacía para que no quede pendiente
      req.flush({});
    });
  });

  // Escenario 2: No hay token en localStorage (no debe añadir el encabezado)
  describe('cuando no hay token', () => {
    it('NO debería añadir un encabezado de Autorización a las peticiones a la API', () => {
      // Aseguramos que no hay token en localStorage (ya lo hace localStorage.clear() en beforeEach)

      // Realizamos una petición HTTP simulada a la URL de nuestra API
      httpClient.get(`${apiUrl}/public-data`).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/public-data`);

      // Verificamos que el encabezado 'Authorization' NO fue añadido
      expect(req.request.headers.has('Authorization')).toBeFalsy();

      req.flush({});
    });
  });

  // Escenario 3: Hay token, pero la petición NO es a la API (no debe añadir el encabezado)
  describe('cuando hay un token pero la petición NO es a la API', () => {
    beforeEach(() => {
      // Configuramos el localStorage con un token de prueba
      localStorage.setItem(TokenKeys.AUTH_TOKEN, dummyToken);
    });

    it('NO debería añadir un encabezado de Autorización a las peticiones externas', () => {
      const externalUrl = 'https://api.ejemplo-externo.com/data';

      // Realizamos una petición HTTP simulada a una URL externa
      httpClient.get(externalUrl).subscribe();

      const req = httpTestingController.expectOne(externalUrl);

      // Verificamos que el encabezado 'Authorization' NO fue añadido
      expect(req.request.headers.has('Authorization')).toBeFalsy();

      req.flush({});
    });
  });

  // Escenario 4: La petición es clonada correctamente si no hay token o no es una petición a la API
  it('debería pasar la petición original si no hay token o no es una petición a la API', () => {
    // Creamos una petición HTTP de prueba
    const originalRequest = new HttpRequest('GET', `${apiUrl}/some-data`);
    // Creamos un mock para el HttpHandler (el 'next' en el interceptor)
    const nextHandler = {
      handle: jasmine.createSpy('handle').and.returnValue(new Observable<HttpEvent<any>>()),
    };

    // Obtenemos una instancia del interceptor
    const interceptor = TestBed.inject(HTTP_INTERCEPTORS)[0] as AuthInterceptor;

    // Ejecutamos el interceptor sin un token en localStorage
    localStorage.clear(); // Aseguramos que no hay token
    interceptor.intercept(originalRequest, nextHandler as HttpHandler);

    // Verificamos que el método 'handle' del siguiente manejador fue llamado con la petición original (sin modificar)
    expect(nextHandler.handle).toHaveBeenCalledWith(originalRequest);
  });
});
