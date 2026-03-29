import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

  const errors: any = {};
  if (!hasUppercase) errors.uppercase = true;
  if (!hasSpecialChar) errors.specialChar = true;

  return Object.keys(errors).length > 0 ? errors : null;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      passwordValidator,
    ]),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Dane do wysłania na backend:', this.registerForm.value);
      //NestJS / Supabase
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
