import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<SnackBarService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    const snackBarMock = jasmine.createSpyObj('SnackBarService', ['info']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
        { provide: SnackBarService, useValue: snackBarMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(SnackBarService) as jasmine.SpyObj<SnackBarService>;
  });

  it('debería permitir el acceso si el usuario está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue();
    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
    expect(snackBarSpy.info).not.toHaveBeenCalled();
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
  });

  it('debería denegar el acceso, mostrar snackbar y redirigir si el usuario no está autenticado', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    const fakeUrlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);

    const result = guard.canActivate({} as any, {} as any);

    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
    expect(snackBarSpy.info).toHaveBeenCalledWith('Por favor iniciar sesión.');
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toBe(fakeUrlTree);
  });
});
