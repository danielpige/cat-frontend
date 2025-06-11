import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordKey);
    const confirmPasswordControl = group.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        ['passwordMismatch']: true,
      });
    } else {
      const errors = { ...confirmPasswordControl.errors };
      delete errors['passwordMismatch'];

      if (Object.keys(errors).length === 0) {
        confirmPasswordControl.setErrors(null);
      } else {
        confirmPasswordControl.setErrors(errors);
      }
    }

    return null;
  };
}
