import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  users: any[] = [];

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe((data) => {
      this.users = data;
    });
  }
}
