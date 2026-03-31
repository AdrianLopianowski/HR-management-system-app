import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  @UseGuards(FirebaseAuthGuard)
  async syncUser(@Req() request: any) {
    const firebaseUser = request.user;

    return this.authService.syncUser(firebaseUser);
  }
}
