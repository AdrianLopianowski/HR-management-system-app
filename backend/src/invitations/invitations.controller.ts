import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth/firebase-auth.guard';

@Controller('invitations')
@UseGuards(FirebaseAuthGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('invite/:workspaceId')
  invite(
    @Param('workspaceId') workspaceId: string,
    @Body('email') email: string,
    @Req() req: any,
  ) {
    return this.invitationsService.invite(workspaceId, email, req.user.uid);
  }

  @Get('my')
  getMy(@Req() req: any) {
    return this.invitationsService.getMyInvitations(req.user.email);
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Req() req: any) {
    return this.invitationsService.acceptInvitation(id, req.user.uid);
  }
}
