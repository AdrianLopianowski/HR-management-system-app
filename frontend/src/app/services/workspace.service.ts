import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private apiUrl = 'http://localhost:3000/workspaces';

  private async getHeaders() {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Użytkownik nie jest zalogowany!');
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async createWorkspace(name: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.post(this.apiUrl, { name }, { headers }));
  }

  async getMyWorkspaces() {
    const headers = await this.getHeaders();
    return firstValueFrom(this.http.get(this.apiUrl, { headers }));
  }

  async getChannels(workspaceId: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.get(`${this.apiUrl}/${workspaceId}/channels`, { headers }),
    );
  }

  async createChannel(workspaceId: string, name: string, type: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.post(
        `${this.apiUrl}/${workspaceId}/channels`,
        { name, type },
        { headers },
      ),
    );
  }
  async getMessages(workspaceId: string, channelId: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.get(
        `${this.apiUrl}/${workspaceId}/channels/${channelId}/messages`,
        { headers },
      ),
    );
  }

  async sendMessage(workspaceId: string, channelId: string, content: string) {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.post(
        `${this.apiUrl}/${workspaceId}/channels/${channelId}/messages`,
        { content },
        { headers },
      ),
    );
  }
}
