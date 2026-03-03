import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-post-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './new-post-modal.html',
  styleUrl: './new-post-modal.scss',
})
export class NewPostModal {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewPostModal>);

  categories = ['Matemáticas', 'Programación', 'Física', 'Campus', 'Tecnología', 'Química', 'Literatura'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    category: ['', [Validators.required]],
    content: ['', [Validators.required, Validators.maxLength(5000)]],
    tags: [''],
  });

  get titleCount() { return (this.form.value.title || '').length; }
  get contentCount() { return (this.form.value.content || '').length; }


  close() {
    this.dialogRef.close();
  }

  publish() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}

