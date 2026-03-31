import { Module } from '@nestjs/common';
import { AuthModule } from './auth/firebase-auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [AuthModule, PrismaModule, WorkspacesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
