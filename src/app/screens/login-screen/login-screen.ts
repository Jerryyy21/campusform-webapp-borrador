import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { AuthService, LoginPayload } from '../../services/auth.services';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen {
  submitting = false;
  form!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validators.institutionalEmail()]],
      password: ['', [Validators.required, this.validators.minLengthTrim(6)]],
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  forgotPassword() {
    alert('Recuperación de contraseña pendiente');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const credentials: LoginPayload = {
      email: this.form.value.email,
      password: this.form.value.password
      // No enviamos role, el backend lo detectará automáticamente
    };

    this.auth.login(credentials).subscribe({
      next: (response) => {
        this.submitting = false;
        // La redirección ya la maneja el AuthService en el tap
        console.log('Login exitoso:', response);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error login:', err);
        
        if (err.status === 401 || err.status === 400) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        } else {
          this.errorMessage = 'Error en el servidor. Intenta de nuevo más tarde.';
        }
      }
    });
  }
}