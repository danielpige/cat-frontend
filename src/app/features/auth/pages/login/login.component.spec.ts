import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../core/services/loader.service';
import { AuthenticationService } from '../../service/authentication.service';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loaderSvcSpy: jasmine.SpyObj<LoaderService>;
  let authSvcSpy: jasmine.SpyObj<AuthenticationService>;
  let snackBarSpy: jasmine.SpyObj<SnackBarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loaderSvcSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    authSvcSpy = jasmine.createSpyObj('AuthenticationService', ['loginUser']);
    snackBarSpy = jasmine.createSpyObj('SnackBarService', ['success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: LoaderService, useValue: loaderSvcSpy },
        { provide: AuthenticationService, useValue: authSvcSpy },
        { provide: SnackBarService, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con campos username y password', () => {
    expect(component.loginForm.contains('username')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('debería marcar el formulario como tocado si es inválido al enviar', () => {
    spyOn(component.loginForm, 'markAllAsTouched');
    component.submitForm();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    expect(loaderSvcSpy.show).not.toHaveBeenCalled();
  });

  it('debería enviar el formulario y navegar al dashboard si el login es exitoso', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'test12345',
    });

    const mockResponse = {
      success: true,
      message: 'Ok',
      data: { user: { fullname: 'test', username: 'testuser', email: 'testuser@example.com', enable: false }, token: 'asdf' },
    };
    authSvcSpy.loginUser.and.returnValue(of(mockResponse));

    component.submitForm();

    expect(loaderSvcSpy.show).toHaveBeenCalled();
    expect(authSvcSpy.loginUser).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'test12345',
    });
    expect(snackBarSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(loaderSvcSpy.hide).toHaveBeenCalled();
  });

  it('debería ocultar el loader si el login falla', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpass',
    });

    authSvcSpy.loginUser.and.returnValue(throwError(() => new Error('Login failed')));

    component.submitForm();

    expect(loaderSvcSpy.show).toHaveBeenCalled();
    expect(loaderSvcSpy.hide).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería invalidar campos si están vacíos o son demasiado cortos', () => {
    const username = component.loginForm.get('username');
    const password = component.loginForm.get('password');

    username?.setValue('');
    password?.setValue('123');

    expect(username?.invalid).toBeTrue();
    expect(password?.invalid).toBeTrue();
  });
});
