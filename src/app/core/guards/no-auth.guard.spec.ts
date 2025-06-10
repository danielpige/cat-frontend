import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // 1. Crear mocks (SpyObjects) para las dependencias
    // Solo necesitamos espiar 'isAuthenticated' para AuthService.
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    // Solo necesitamos espiar 'navigate' para Router.
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // 2. Configurar el TestBed para el guard
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // Proporciona servicios mock del Router para las pruebas
      ],
      providers: [
        NoAuthGuard, // El guard que estamos probando
        { provide: AuthService, useValue: mockAuthService }, // Proporcionar el mock de AuthService
        { provide: Router, useValue: mockRouter }, // Proporcionar el mock de Router
      ],
    });

    // 3. Inyectar el guard para las pruebas
    guard = TestBed.inject(NoAuthGuard);
  });

  // Prueba básica para asegurar que el guard se crea correctamente
  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // pruebas para cuando el usuario está autenticado
  describe('when user is authenticated', () => {
    beforeEach(() => {
      // Configurar mockAuthService.isAuthenticated para que devuelva true
      mockAuthService.isAuthenticated.and.returnValue(true);
    });

    it('should return false', () => {
      const canActivateResult = guard.canActivate();
      // Esperar que canActivate devuelva false, impidiendo el acceso
      expect(canActivateResult).toBe(false);
    });

    it('should navigate to /dashboard', () => {
      guard.canActivate();
      // Esperar que el router haya intentado navegar a /dashboard
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  // pruebas para cuando el usuario NO está autenticado
  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      // Configurar mockAuthService.isAuthenticated para que devuelva false
      mockAuthService.isAuthenticated.and.returnValue(false);
    });

    it('should return true', () => {
      const canActivateResult = guard.canActivate();
      // Esperar que canActivate devuelva true, permitiendo el acceso
      expect(canActivateResult).toBe(true);
    });

    it('should NOT navigate', () => {
      guard.canActivate();
      // Esperar que el método navigate del router NO haya sido llamado
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
