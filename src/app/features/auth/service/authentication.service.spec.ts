import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { HttpService } from '../../../core/services/http.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { ApiResponse } from '../../../core/models/apiResponse.model';
import { LoginValues, RegisterValues, UserResponse } from '../../../core/models/user.model';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['post']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['setDataUserLogged']);

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(AuthenticationService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar un usuario y llamar a setDataUserLogged si la respuesta es exitosa', () => {
    const userData: RegisterValues = {
      fullname: 'Juan',
      username: 'juanmaas',
      email: 'juan@test.com',
      password: '123456',
      confirmPassword: '123456',
    };
    const mockResponse: ApiResponse<UserResponse> = {
      success: true,
      message: 'Registrado correctamente',
      data: { token: 'abc123', user: { fullname: 'Juan', username: 'juanmaas', email: 'juan@test.com' } },
    };

    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.registerUser(userData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(authServiceSpy.setDataUserLogged).toHaveBeenCalledWith(mockResponse.data);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith('users/register', userData);
  });

  it('debería hacer login y llamar a setDataUserLogged si la respuesta es exitosa', () => {
    const userData: LoginValues = { username: 'juanmaas', password: '123456' };
    const mockResponse: ApiResponse<UserResponse> = {
      success: true,
      message: 'Login exitoso',
      data: { token: 'abc123', user: { fullname: 'Juan', username: 'juanmaas' } },
    };

    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.loginUser(userData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(authServiceSpy.setDataUserLogged).toHaveBeenCalledWith(mockResponse.data);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith('users/login', userData);
  });

  it('no debería llamar a setDataUserLogged si la respuesta no es exitosa', () => {
    const userData: LoginValues = { username: 'juanmaas', password: 'wrongpass' };
    const mockResponse: ApiResponse<UserResponse> = {
      success: false,
      message: 'Credenciales inválidas',
      data: null as any,
    };

    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.loginUser(userData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(authServiceSpy.setDataUserLogged).not.toHaveBeenCalled();
    });
  });
});
