import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private workspaceService = inject(WorkspaceService);

  workspaces: any[] = [];
  activeWorkspace: any = null;
  isLoadingWorkspaces = true;

  async ngOnInit() {
    await this.loadWorkspaces();
  }

  async loadWorkspaces() {
    this.isLoadingWorkspaces = true;
    try {
      const data: any = await this.workspaceService.getMyWorkspaces();
      this.workspaces = data;

      if (this.workspaces.length > 0 && !this.activeWorkspace) {
        this.activeWorkspace = this.workspaces[0];
      }
    } catch (error) {
      console.error('Błąd pobierania przestrzeni:', error);
    } finally {
      this.isLoadingWorkspaces = false;
    }
  }

  async onAddWorkspace() {
    console.log('🔘 Przycisk PLUS został kliknięty!'); // <-- DODAJ TO
    const workspaceName = prompt('Podaj nazwę nowej Przestrzeni Roboczej:');

    if (workspaceName && workspaceName.trim().length > 0) {
      try {
        await this.workspaceService.createWorkspace(workspaceName);
        await this.loadWorkspaces();
      } catch (error) {
        console.error('Błąd podczas tworzenia przestrzeni:', error);
        alert('Wystąpił błąd podczas tworzenia. Sprawdź konsolę.');
      }
    }
  }

  selectWorkspace(workspace: any) {
    this.activeWorkspace = workspace;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
