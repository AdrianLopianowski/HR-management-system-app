import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';
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

  messages: any[] = [];
  newMessageContent = '';

  invitations: any[] = [];
  isNotificationOpen = false;
  isInviteModalOpen = false;
  inviteEmail = '';
  isInviting = false;

  myProfile: any = null;
  showOnboarding = false;
  onboardingData = {
    firstName: '',
    lastName: '',
    location: '',
  };

  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.loadMyProfile();

        if (!this.myProfile?.firstName) {
          this.showOnboarding = true;
          return;
        }

        await this.loadWorkspaces();
        await this.loadInvitations();
      }
    });
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
  async loadMessages() {
    if (!this.activeWorkspace || !this.activeChannel) return;
    try {
      this.messages = (await this.workspaceService.getMessages(
        this.activeWorkspace.id,
        this.activeChannel.id,
      )) as any[];
    } catch (e) {
      console.error('Błąd pobierania wiadomości', e);
    }
  }
  async sendMessage() {
    if (
      !this.newMessageContent.trim() ||
      !this.activeWorkspace ||
      !this.activeChannel
    )
      return;
    try {
      await this.workspaceService.sendMessage(
        this.activeWorkspace.id,
        this.activeChannel.id,
        this.newMessageContent,
      );
      this.newMessageContent = '';
      await this.loadMessages();
    } catch (e) {
      console.error('Błąd wysyłania', e);
      alert('Nie udało się wysłać wiadomości. Brak uprawnień?');
    }
  }
  async selectChannel(channel: any, event: Event) {
    event.preventDefault();
    this.activeChannel = channel;
    await this.loadMessages();
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
  get currentUserRole(): string {
    if (!this.activeWorkspace || !this.auth.currentUser) return 'MEMBER';
    const member = this.activeWorkspace.members.find(
      (m: any) => m.userId === this.auth.currentUser?.uid,
    );
    return member ? member.role : 'MEMBER';
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

  async loadInvitations() {
    try {
      const data: any = await this.workspaceService.getMyInvitations();
      this.invitations = data || [];
      console.log('Pobrane zaproszenia z serwera:', this.invitations);
    } catch (error) {
      console.error('Błąd pobierania zaproszeń:', error);
    }
  }
  openInviteModal() {
    this.inviteEmail = '';
    this.isInviteModalOpen = true;
  }

  closeInviteModal() {
    this.isInviteModalOpen = false;
    this.inviteEmail = '';
  }

  async submitInvite() {
    if (!this.inviteEmail.trim() || !this.activeWorkspace) return;

    this.isInviting = true;
    try {
      await this.workspaceService.inviteUser(
        this.activeWorkspace.id,
        this.inviteEmail.trim(),
      );
      alert(`Wysłano zaproszenie do: ${this.inviteEmail}`);
      this.closeInviteModal();
    } catch (e) {
      console.error('Błąd wysyłania zaproszenia:', e);
      alert('Nie udało się wysłać zaproszenia. Sprawdź konsolę.');
    } finally {
      this.isInviting = false;
    }
  }

  async acceptInv(id: string) {
    await this.workspaceService.acceptInvitation(id);
    await this.loadWorkspaces();
    await this.loadInvitations();
    this.isNotificationOpen = false;
  }
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
  async loadMyProfile() {
    try {
      this.myProfile = await this.workspaceService.getMyProfile();
    } catch (error) {
      console.error('Błąd pobierania profilu:', error);
    }
  }

  async submitOnboarding() {
    if (!this.onboardingData.firstName || !this.onboardingData.lastName) {
      alert('Imię i nazwisko są wymagane!');
      return;
    }

    try {
      await this.workspaceService.updateMyProfile(this.onboardingData);

      this.showOnboarding = false;

      await this.loadWorkspaces();
      await this.loadInvitations();
    } catch (error) {
      console.error('Błąd zapisu profilu:', error);
      alert('Nie udało się zapisać danych.');
    }
  }
}
