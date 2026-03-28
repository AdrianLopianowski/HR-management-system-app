import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Strona główna
  { path: 'login', component: LoginComponent }, // Logowanie
  { path: 'register', component: RegisterComponent }, // Rejestracja
];
