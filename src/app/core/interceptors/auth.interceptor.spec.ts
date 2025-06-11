import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TokenKeys } from '../enums/tokenKey.enum';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const API_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('debería agregar el token de autorización para peticiones API', () => {
    const mockToken = 'mocked_token';
    localStorage.setItem(TokenKeys.AUTH_TOKEN, mockToken);

    httpClient.get(`${API_URL}/test-endpoint`).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`${API_URL}/test-endpoint`);

    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    httpRequest.flush({ data: 'ok' });
  });

  it('NO debería agregar el token si la URL no pertenece a la API', () => {
    const mockToken = 'mocked_token';
    localStorage.setItem(TokenKeys.AUTH_TOKEN, mockToken);

    httpClient.get(`https://externo.com/recurso`).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`https://externo.com/recurso`);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();

    httpRequest.flush({ data: 'ok' });
  });

  it('NO debería agregar el token si no hay token en localStorage', () => {
    localStorage.removeItem(TokenKeys.AUTH_TOKEN);

    httpClient.get(`${API_URL}/otra-ruta`).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(`${API_URL}/otra-ruta`);

    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();

    httpRequest.flush({ data: 'ok' });
  });
});
