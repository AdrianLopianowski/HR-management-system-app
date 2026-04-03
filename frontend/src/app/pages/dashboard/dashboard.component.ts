import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { WorkspaceService } from '../../services/workspace.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private workspaceService = inject(WorkspaceService);
  public themeService = inject(ThemeService);
  workspaces: any[] = [];
  activeWorkspace: any = null;
  activeChannel: any = null;
  isLoadingWorkspaces = true;

  isCreateModalOpen = false;
  newWorkspaceName = '';
  isCreating = false;

  channels: any[] = [];
  isChannelModalOpen = false;
  newChannelName = '';
  newChannelType: 'TEXT' | 'INFO' = 'TEXT';

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
        await this.loadChannels(this.activeWorkspace.id);
      }
    } catch (error) {
      console.error('Błąd pobierania przestrzeni:', error);
    } finally {
      this.isLoadingWorkspaces = false;
    }
  }
  selectChannel(channel: any, event: Event) {
    event.preventDefault();
    this.activeChannel = channel;
  }
  openCreateModal() {
    this.newWorkspaceName = '';
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.newWorkspaceName = '';
  }

  async submitNewWorkspace() {
    if (!this.newWorkspaceName || this.newWorkspaceName.trim().length === 0)
      return;

    this.isCreating = true;
    try {
      await this.workspaceService.createWorkspace(this.newWorkspaceName.trim());
      await this.loadWorkspaces();
      this.closeCreateModal();
    } catch (error) {
      console.error('Błąd podczas tworzenia przestrzeni:', error);
      alert('Wystąpił błąd podczas tworzenia. Sprawdź konsolę.');
    } finally {
      this.isCreating = false;
    }
  }

  async selectWorkspace(workspace: any) {
    this.activeWorkspace = workspace;
    this.activeChannel = null;
    await this.loadChannels(workspace.id);
  }

  async loadChannels(workspaceId: string) {
    try {
      const data: any = await this.workspaceService.getChannels(workspaceId);
      this.channels = data;
    } catch (e: any) {
      console.error('Błąd pobierania kanałów', e);
    }
  }
  async submitNewChannel() {
    if (!this.newChannelName || !this.activeWorkspace) return;
    try {
      await this.workspaceService.createChannel(
        this.activeWorkspace.id,
        this.newChannelName,
        this.newChannelType,
      );
      await this.loadChannels(this.activeWorkspace.id);
      this.isChannelModalOpen = false;
      this.newChannelName = '';
    } catch (e: any) {
      alert('Tylko właściciel może tworzyć kanały!');
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
