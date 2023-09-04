import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  exports: [CredentialsService]
})
export class CredentialsModule {}
