import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorServices {

  // Dominios específicos por rol
  private readonly domains = {
    student: '@alumno.buap.mx',
    teacher: '@buap.mx',
    admin: '@admin.buap.mx'
  };

  // Regex para cada tipo de usuario
  private readonly studentEmailRegex = /^[^\s@]+@alumno\.buap\.mx$/i;
  private readonly teacherEmailRegex = /^[^\s@]+@buap\.mx$/i;
  private readonly adminEmailRegex = /^[^\s@]+@admin\.buap\.mx$/i;

  // Regex para nombre: solo letras y espacios
  private readonly nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  // Regex para contraseña: mínimo 8 caracteres, al menos una mayúscula y un número
  private readonly passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Validador general para login (acepta cualquier dominio institucional)
  institutionalEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      
      const isValid = this.studentEmailRegex.test(value) || 
                      this.teacherEmailRegex.test(value) || 
                      this.adminEmailRegex.test(value);
      
      return isValid ? null : { institutionalEmail: true };
    };
  }

  // NUEVO: Validador que verifica el email según el rol seleccionado
  emailByRole(roleControl: AbstractControl | null): ValidatorFn {
    return (emailControl: AbstractControl): ValidationErrors | null => {
      const email = (emailControl.value ?? '').toString().trim();
      if (!email) return null;

      const role = roleControl?.value;
      
      // Si no hay rol seleccionado, no validar aún
      if (!role) return null;

      let isValid = false;
      let expectedDomain = '';

      switch (role) {
        case 'student':
          isValid = this.studentEmailRegex.test(email);
          expectedDomain = this.domains.student;
          break;
        case 'teacher':
          isValid = this.teacherEmailRegex.test(email);
          expectedDomain = this.domains.teacher;
          break;
        case 'admin':
          isValid = this.adminEmailRegex.test(email);
          expectedDomain = this.domains.admin;
          break;
      }

      if (!isValid) {
        return { 
          invalidEmailForRole: {
            expected: expectedDomain,
            role: role
          }
        };
      }

      return null;
    };
  }

  // Validador para registro (SIN admin) - Lo mantengo por si acaso
  institutionalEmailNoAdmin(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      
      const isValid = this.studentEmailRegex.test(value) || 
                      this.teacherEmailRegex.test(value);
      
      return isValid ? null : { institutionalEmailNoAdmin: true };
    };
  }

  // Validador para nombre (solo letras y espacios)
  validName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      
      const isValid = this.nameRegex.test(value);
      return isValid ? null : { invalidName: true };
    };
  }

  // Validador para contraseña fuerte
  strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString();
      if (!value) return null;
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasMinLength = value.length >= 8;
      
      if (hasMinLength && hasUpperCase && hasNumber) {
        return null;
      }
      
      const errors: any = {};
      if (!hasMinLength) errors['minLength'] = { required: 8, actual: value.length };
      if (!hasUpperCase) errors['missingUppercase'] = true;
      if (!hasNumber) errors['missingNumber'] = true;
      
      return { weakPassword: errors };
    };
  }

  minLengthTrim(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      return value.length >= min ? null : { minLengthTrim: { min } };
    };
  }

  /** Valida que dos campos de un FormGroup coincidan (ej: password y confirmPassword) */
  matchFields(fieldA: string, fieldB: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const a = (group.get(fieldA)?.value ?? '').toString();
      const b = (group.get(fieldB)?.value ?? '').toString();

      if (!a || !b) return null; // required se encarga

      if (a === b) {
        // limpia error en confirm si existe
        const confirm = group.get(fieldB);
        if (confirm?.hasError('fieldsMismatch')) {
          const errors = { ...(confirm.errors || {}) };
          delete errors['fieldsMismatch'];
          confirm.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
      }

      // marca error en confirm
      const confirm = group.get(fieldB);
      if (confirm) {
        confirm.setErrors({ ...(confirm.errors || {}), fieldsMismatch: true });
      }

      return { fieldsMismatch: true };
    };
  }
}