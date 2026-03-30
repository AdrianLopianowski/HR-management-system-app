import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  async logout() {
    try {
      await signOut(this.auth);
      console.log('Pomyślnie wylogowano!');

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  }
}
