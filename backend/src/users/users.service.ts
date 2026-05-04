import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateProfile(uid: string, email: string) {
    return this.prisma.user.upsert({
      where: { id: uid },
      update: {},
      create: { id: uid, email: email },
    });
  }

  async updateProfile(
    uid: string,
    data: { firstName: string; lastName: string; location: string },
  ) {
    return this.prisma.user.update({
      where: { id: uid },
      data,
    });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
