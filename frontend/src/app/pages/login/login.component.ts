import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage: string | null = null;
  isLoading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      try {
        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          email,
          password,
        );

        if (!userCredential.user.emailVerified) {
          await signOut(this.auth);
          this.router.navigate(['/verify-email']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        console.error('Błąd logowania Firebase:', error);
        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          this.errorMessage = 'Błędny adres e-mail lub hasło.';
        } else {
          this.errorMessage =
            'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Błąd logowania Google:', error);
      this.errorMessage = 'Wystąpił błąd podczas logowania przez Google.';
    }
  }
}
