import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log(
        'Wysyłam link resetujący na:',
        this.forgotPasswordForm.value.email,
      );
      // NestJS / Supabase
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
