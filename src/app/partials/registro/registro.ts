import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { AuthService } from '../../services/auth.services';

type Role = 'student' | 'teacher';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  submitting = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices,
    private auth: AuthService
  ) {
    this.form = this.fb.group(
      {
        name: ['', [
          Validators.required,
          this.validators.validName() // Nuevo validador para nombre
        ]],
        email: ['', [
          Validators.required, 
          this.validators.institutionalEmailNoAdmin()
        ]],
        role: ['student' as Role, [Validators.required]],
        password: ['', [
          Validators.required,
          this.validators.strongPassword() // Nuevo validador para contraseña
        ]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.validators.matchFields('password', 'confirmPassword')] }
    );
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  // Método auxiliar para obtener mensajes de error específicos de contraseña
  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.password;
    
    if (passwordControl?.touched && passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        errors.push('La contraseña es requerida');
      }
      if (passwordControl.errors['weakPassword']) {
        const weakErrors = passwordControl.errors['weakPassword'];
        if (weakErrors['minLength']) {
          errors.push(`La contraseña debe tener al menos ${weakErrors['minLength'].required} caracteres`);
        }
        if (weakErrors['missingUppercase']) {
          errors.push('Debe contener al menos una letra mayúscula');
        }
        if (weakErrors['missingNumber']) {
          errors.push('Debe contener al menos un número');
        }
      }
    }
    return errors;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const payload = {
      name: (this.form.value.name || '').trim(),
      email: (this.form.value.email || '').trim(),
      password: (this.form.value.password || '').trim(),
      role: this.form.value.role as Role,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting = false;
        // aquí puedes mostrar un mat-snack-bar o mat-error global
        console.error('Error register:', err?.error || err);
      }
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}