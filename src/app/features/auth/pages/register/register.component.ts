import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm, RegisterValues } from '../../../../core/models/user.model';
import { LoaderService } from '../../../../core/services/loader.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../core/services/snack-bar.service';
import { passwordMatchValidator } from '../../../../core/utils/validators/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup<RegisterForm>;

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private loaderSvc: LoaderService,
    private authenticationSvc: AuthenticationService,
    private router: Router,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group<RegisterForm>(
      {
        username: this.fb.control(null, { validators: [Validators.required, Validators.minLength(3)] }),
        fullname: this.fb.control(null, { validators: [Validators.required, Validators.minLength(3)] }),
        email: this.fb.control(null, { validators: [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)] }),
        password: this.fb.control(null, {
          validators: [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)],
        }),
        confirmPassword: this.fb.control(null, {
          validators: [Validators.required],
        }),
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const data = this.registerForm.value as RegisterValues;

    this.authenticationSvc.registerUser(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.success('Te has registrado e iniciado sesión correctamente.');
          this.loaderSvc.hide();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.loaderSvc.hide();
      },
    });
  }

  get confirmPassword(): AbstractControl<string> {
    return this.registerForm.get('confirmPassword') as AbstractControl<string>;
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickEventConfirmPassword(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }
}
