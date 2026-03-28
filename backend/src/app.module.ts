import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [PrismaModule, UsersModule, WorkspacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
