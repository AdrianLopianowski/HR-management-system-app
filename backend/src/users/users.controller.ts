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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.getOrCreateProfile(req.user.uid, req.user.email);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch('me')
  updateProfile(
    @Req() req: any,
    @Body() body: { firstName: string; lastName: string; location: string },
  ) {
    return this.usersService.updateProfile(req.user.uid, body);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto as any);
  }

  @Get('seed')
  seedUser() {
    return this.usersService.create({
      email: 'jan.kowalski@firma.pl',
      firstName: 'Jan',
      lastName: 'Kowalski',
    } as any);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
