import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoaderService } from '../../../../core/services/loader.service';
import { AuthenticationService } from '../../service/authentication.service';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loaderSvcSpy: jasmine.SpyObj<LoaderService>;
  let authSvcSpy: jasmine.SpyObj<AuthenticationService>;
  let snackBarSpy: jasmine.SpyObj<SnackBarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loaderSvcSpy = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    authSvcSpy = jasmine.createSpyObj('AuthenticationService', ['registerUser']);
    snackBarSpy = jasmine.createSpyObj('SnackBarService', ['success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: LoaderService, useValue: loaderSvcSpy },
        { provide: AuthenticationService, useValue: authSvcSpy },
        { provide: SnackBarService, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> initForm
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con controles', () => {
    expect(component.registerForm.contains('username')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('confirmPassword')).toBeTrue();
  });

  it('debería marcar todos los campos como tocados si el formulario es inválido al enviar', () => {
    spyOn(component.registerForm, 'markAllAsTouched');
    component.submitForm();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
    expect(loaderSvcSpy.show).not.toHaveBeenCalled();
  });

  it('debería mostrar y ocultar la contraseña al hacer click en el botón', () => {
    const initial = component.hidePassword();
    component.clickEventPassword(new MouseEvent('click'));
    expect(component.hidePassword()).toBe(!initial);
  });

  it('debería mostrar y ocultar la confirmación de contraseña al hacer click en el botón', () => {
    const initial = component.hideConfirmPassword();
    component.clickEventConfirmPassword(new MouseEvent('click'));
    expect(component.hideConfirmPassword()).toBe(!initial);
  });

  it('debería registrar al usuario y navegar al dashboard si todo va bien', () => {
    component.registerForm.setValue({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    const mockResponse = {
      success: true,
      message: 'Ok',
      data: {
        user: {
          username: 'testuser',
          fullname: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        },
        token: 'asdf',
      },
    };
    authSvcSpy.registerUser.and.returnValue(of(mockResponse));

    component.submitForm();

    expect(loaderSvcSpy.show).toHaveBeenCalled();
    expect(authSvcSpy.registerUser).toHaveBeenCalledWith(
      jasmine.objectContaining({
        username: 'testuser',
      })
    );
    expect(snackBarSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería manejar errores al registrar usuario', () => {
    component.registerForm.setValue({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    authSvcSpy.registerUser.and.returnValue(throwError(() => new Error('Error')));

    component.submitForm();

    expect(loaderSvcSpy.hide).toHaveBeenCalled();
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.registerForm.setValue({
      username: 'testuser',
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Different123!',
    });

    component.submitForm();

    const confirmControl = component.registerForm.get('confirmPassword');
    expect(confirmControl?.errors).toBeTruthy();
    expect(confirmControl?.errors?.['passwordMismatch']).toBeTrue();
  });
});
