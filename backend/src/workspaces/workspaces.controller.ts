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
}
