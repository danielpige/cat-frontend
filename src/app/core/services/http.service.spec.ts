import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SnackBarService } from './snack-bar.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;
  let snackBarSvcSpy: jasmine.SpyObj<SnackBarService>;
  let authSvcSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('SnackBarService', ['error']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpService,
        { provide: SnackBarService, useValue: snackBarSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routeSpy },
      ],
    });

    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBarSvcSpy = TestBed.inject(SnackBarService) as jasmine.SpyObj<SnackBarService>;
    authSvcSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería realizar una petición GET', () => {
    const datosEsperados = { mensaje: 'éxito' };

    service.get('/test').subscribe((respuesta) => {
      expect(respuesta).toEqual(datosEsperados);
    });

    const req = httpMock.expectOne(baseUrl + '/test');
    expect(req.request.method).toBe('GET');
    req.flush(datosEsperados);
  });

  it('debería realizar una petición POST', () => {
    const cuerpo = { nombre: 'Juan' };
    const respuesta = { id: 1 };

    service.post('/usuarios', cuerpo).subscribe((res) => {
      expect(res).toEqual(respuesta);
    });

    const req = httpMock.expectOne(baseUrl + '/usuarios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cuerpo);
    req.flush(respuesta);
  });

  it('debería realizar una petición PUT', () => {
    const cuerpo = { nombre: 'Actualizado' };
    const respuesta = { ok: true };

    service.put('/usuarios/1', cuerpo).subscribe((res) => {
      expect(res).toEqual(respuesta);
    });

    const req = httpMock.expectOne(baseUrl + '/usuarios/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cuerpo);
    req.flush(respuesta);
  });

  it('debería realizar una petición DELETE', () => {
    const respuesta = { eliminado: true };

    service.delete('/usuarios/1').subscribe((res) => {
      expect(res).toEqual(respuesta);
    });

    const req = httpMock.expectOne(baseUrl + '/usuarios/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(respuesta);
  });

  it('debería manejar error 401 cerrando sesión y redireccionando', () => {
    service.get('/test').subscribe({
      error: (error) => {
        expect(authSvcSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
        expect(snackBarSvcSpy.error).toHaveBeenCalledWith(jasmine.any(String));
      },
    });

    const req = httpMock.expectOne(baseUrl + '/test');
    req.flush({ message: 'No autorizado' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('debería mostrar mensaje de error por defecto si no hay mensaje en el error', () => {
    service.get('/test').subscribe({
      error: () => {
        expect(snackBarSvcSpy.error).toHaveBeenCalledWith('Ha ocurrido un error inesperado.');
      },
    });

    const req = httpMock.expectOne(baseUrl + '/test');
    req.flush({}, { status: 500, statusText: 'Error Interno' });
  });
});
