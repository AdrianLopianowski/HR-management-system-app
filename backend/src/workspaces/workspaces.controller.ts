import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth/firebase-auth.guard';

@Controller('workspaces')
@UseGuards(FirebaseAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Req() req: any, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    createWorkspaceDto.userId = req.user.uid;

    console.log('--- 1. TWORZENIE NOWEJ PRZESTRZENI ---');
    console.log('Twórca (Firebase UID):', req.user.uid);
    console.log('Dane przestrzeni:', createWorkspaceDto);

    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get('test-create/:userId')
  testCreate(@Param('userId') userId: string) {
    return this.workspacesService.create({
      name: 'Moja Super Firma',
      userId: userId,
    });
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.uid;
    return this.workspacesService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(id);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.workspacesService.getMembers(id);
  }

  @Patch(':id/members/:userId/role')
  updateMemberRole(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
    @Body('role') role: 'OWNER' | 'ADMIN' | 'MEMBER',
    @Req() req: any,
  ) {
    return this.workspacesService.updateMemberRole(
      workspaceId,
      userId,
      role,
      req.user.uid,
    );
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
    @Req() req: any,
  ) {
    return this.workspacesService.removeMember(
      workspaceId,
      userId,
      req.user.uid,
    );
  }

  @Get(':id/channels')
  findAllChannels(@Param('id') id: string) {
    return this.workspacesService.getChannels(id);
  }

  @Post(':id/channels')
  createChannel(
    @Param('id') id: string,
    @Body() body: { name: string; type: 'TEXT' | 'INFO' },
    @Req() req: any,
  ) {
    console.log('--- 2. TWORZENIE KANAŁU ---');
    console.log('ID Przestrzeni roboczej:', id);
    console.log('Nazwa kanału:', body.name);
    console.log('Typ kanału:', body.type);
    console.log('ID użytkownika (Firebase UID):', req.user.uid);

    return this.workspacesService.createChannel(
      id,
      body.name,
      body.type,
      req.user.uid,
    );
  }
  @Get(':id/channels/:channelId/messages')
  getMessages(@Param('channelId') channelId: string) {
    return this.workspacesService.getMessages(channelId);
  }

  @Post(':id/channels/:channelId/messages')
  sendMessage(
    @Param('id') workspaceId: string,
    @Param('channelId') channelId: string,
    @Body('content') content: string,
    @Req() req: any,
  ) {
    return this.workspacesService.sendMessage(
      workspaceId,
      channelId,
      req.user.uid,
      content,
    );
  }
}
