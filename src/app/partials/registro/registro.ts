import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { AuthService } from '../../services/auth.services';

type Role = 'student' | 'teacher' | 'admin';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {
  submitting = false;
  form!: FormGroup;

  // Mapa de dominios para mostrar en mensajes de error
  domainMap = {
    student: '@alumno.buap.mx',
    teacher: '@buap.mx',
    admin: '@admin.buap.mx'
  };

  // Mapa de nombres de roles en español
  roleNames = {
    student: 'estudiante',
    teacher: 'profesor',
    admin: 'administrador'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        name: ['', [
          Validators.required,
          this.validators.validName()
        ]],
        email: ['', [
          Validators.required
        ]],
        role: ['student' as Role, [Validators.required]],
        password: ['', [
          Validators.required,
          this.validators.strongPassword()
        ]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [
        this.validators.matchFields('password', 'confirmPassword')
      ]}
    );

    // Escuchar cambios en el rol para actualizar la validación del email
    this.form.get('role')?.valueChanges.subscribe(() => {
      this.form.get('email')?.updateValueAndValidity();
    });

    // Aplicar validador condicional al email
    this.setupEmailValidator();
  }

  setupEmailValidator() {
    const roleControl = this.form.get('role');
    const emailControl = this.form.get('email');

    if (emailControl) {
      emailControl.setValidators([
        Validators.required,
        this.validators.emailByRole(roleControl)
      ]);
      emailControl.updateValueAndValidity();
    }
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  // Obtener el placeholder para el email según el rol
  getEmailPlaceholder(): string {
    const roleValue = this.role?.value as Role;
    if (roleValue && this.domainMap[roleValue]) {
      return `ejemplo${this.domainMap[roleValue]}`;
    }
    return 'correo@dominio.com';
  }

  // Obtener mensaje de error específico para email según el rol
  getEmailErrorMessage(): string {
    const emailControl = this.email;
    const roleValue = this.role?.value as Role;

    if (emailControl?.touched && emailControl?.errors) {
      if (emailControl.errors['required']) {
        return 'El correo es requerido';
      }
      if (emailControl.errors['invalidEmailForRole'] && roleValue) {
        const expectedDomain = this.domainMap[roleValue];
        const roleName = this.roleNames[roleValue];
        return `Los ${roleName}s deben usar correo ${expectedDomain}`;
      }
    }
    return '';
  }

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
          errors.push('Mínimo 8 caracteres');
        }
        if (weakErrors['missingUppercase']) {
          errors.push('Debe tener al menos una mayúscula');
        }
        if (weakErrors['missingNumber']) {
          errors.push('Debe tener al menos un número');
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

    console.log('Registrando:', payload);

    this.auth.register(payload).subscribe({
      next: () => {
        this.submitting = false;
        // REDIRIGIR A LA PÁGINA DE LOGIN
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting = false;
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