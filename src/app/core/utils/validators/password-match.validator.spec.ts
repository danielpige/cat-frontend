import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup(
      {
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
      },
      { validators: passwordMatchValidator('password', 'confirmPassword') }
    );
  });

  it('no debe establecer errores si las contraseñas coinciden', () => {
    form.get('password')?.setValue('123456');
    form.get('confirmPassword')?.setValue('123456');

    form.updateValueAndValidity();

    const errors = form.get('confirmPassword')?.errors;
    expect(errors).toBeNull();
  });

  it('debe establecer error passwordMismatch si las contraseñas no coinciden', () => {
    form.get('password')?.setValue('123456');
    form.get('confirmPassword')?.setValue('654321');

    form.updateValueAndValidity();

    const errors = form.get('confirmPassword')?.errors;
    expect(errors).toBeTruthy();
    expect(errors?.['passwordMismatch']).toBeTrue();
  });

  it('debe eliminar passwordMismatch si luego coinciden', () => {
    form.get('password')?.setValue('abc123');
    form.get('confirmPassword')?.setValue('def456');
    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors?.['passwordMismatch']).toBeTrue();

    form.get('confirmPassword')?.setValue('abc123');
    form.updateValueAndValidity();

    expect(form.get('confirmPassword')?.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('no debe lanzar error si los controles no existen', () => {
    const dummyGroup = new FormGroup({});
    const validator = passwordMatchValidator('password', 'confirmPassword');
    expect(() => validator(dummyGroup)).not.toThrow();
  });
});
