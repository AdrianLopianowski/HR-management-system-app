import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        members: {
          create: {
            userId: createWorkspaceDto.userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: { members: true },
    });
  }

  update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
    });
  }

  remove(id: string) {
    return this.prisma.workspace.delete({
      where: { id },
    });
  }

  async getChannels(workspaceId: string) {
    return this.prisma.channel.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createChannel(
    workspaceId: string,
    name: string,
    type: 'TEXT' | 'INFO',
    userId: string,
  ) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!member) throw new Error('Brak uprawnień do tworzenia kanałów');

    return this.prisma.channel.create({
      data: {
        name,
        type,
        workspaceId,
      },
    });
  }

  async getMessages(channelId: string) {
    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    });

    return messages.map((msg: any) => ({
      ...msg,
      user: {
        ...msg.user,
        name:
          msg.user?.firstName && msg.user?.lastName
            ? `${msg.user.firstName} ${msg.user.lastName}`
            : msg.user?.name || msg.user?.email || 'Nieznany',
      },
    }));
  }

  async sendMessage(
    workspaceId: string,
    channelId: string,
    userId: string,
    content: string,
  ) {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });

    if (!member) throw new Error('Brak dostępu do tej przestrzeni');

    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });

    if (channel?.type === 'INFO' && member.role === 'MEMBER') {
      throw new Error(
        'Tylko Właściciel lub Admin może pisać na kanale informacyjnym.',
      );
    }
    const newMessage: any = await this.prisma.message.create({
      data: {
        content,
        channelId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return {
      ...newMessage,
      user: {
        ...newMessage.user,
        name:
          newMessage.user?.firstName && newMessage.user?.lastName
            ? `${newMessage.user.firstName} ${newMessage.user.lastName}`
            : newMessage.user?.name || newMessage.user?.email || 'Nieznany',
      },
    };
  }
}
