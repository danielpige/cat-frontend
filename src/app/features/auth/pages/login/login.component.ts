import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginForm, LoginValues } from '../../../../core/models/user.model';
import { LoaderService } from '../../../../core/services/loader.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../core/services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  hidePassword = signal(true);

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
    this.loginForm = this.fb.group<LoginForm>({
      username: this.fb.control(null, { validators: [Validators.required, Validators.minLength(3)] }),
      password: this.fb.control(null, {
        validators: [Validators.required, Validators.minLength(5)],
      }),
    });
  }

  clickEventPassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const data = this.loginForm.value as LoginValues;

    this.authenticationSvc.loginUser(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.success('Has iniciado sesión correctamente.');
          this.loaderSvc.hide();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.loaderSvc.hide();
      },
    });
  }
}
