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

  findAll() {
    return this.prisma.workspace.findMany();
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
}
