import { Module } from '@nestjs/common';
import { AuthModule } from './auth/firebase-auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [AuthModule, PrismaModule, WorkspacesModule, InvitationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
