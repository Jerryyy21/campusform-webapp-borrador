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
        name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/) ]],
        email: ['', [Validators.required, Validators.email, this.validators.institutionalEmailNoAdmin()]],
        role: ['student' as Role, [Validators.required]],
        password: ['', [Validators.required, this.validators.minLengthTrim(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.validators.matchFields('password', 'confirmPassword')] }
    );
  }

  sanitizeName() {
    const control = this.form.get('name');
    if (!control) return;

    const value = (control.value || '') as string;

    // restringir datos
    const cleaned = value
      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();

    if (cleaned !== value) {
      control.setValue(cleaned, { emitEvent: false });
    }
  }
  sanitizeEmail() {
    const control = this.form.get('email');
    if (!control) return;

    const value = (control.value || '') as string;

    const cleaned = value
      .replace(/\s/g, '')
      .toLowerCase();

    if (cleaned !== value) {
      control.setValue(cleaned, { emitEvent: false });
    }
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

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
