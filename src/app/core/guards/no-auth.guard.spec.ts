import { TestBed } from '@angular/core/testing';
import { NoAuthGuard } from './no-auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [NoAuthGuard, { provide: AuthService, useValue: authServiceSpy }, { provide: Router, useValue: routerSpy }],
    });

    guard = TestBed.inject(NoAuthGuard);
  });

  it('debería crearse correctamente', () => {
    expect(guard).toBeTruthy();
  });

  it('debería permitir el acceso si el usuario NO está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería bloquear el acceso y redirigir si el usuario está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
