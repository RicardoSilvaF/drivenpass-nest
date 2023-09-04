import { Body, Controller, Get, Param, Post, UseGuards, ParseIntPipe, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/credentials.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User as UserPrisma } from '@prisma/client';

@Controller('credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
    constructor(private readonly service: CredentialsService) { }

    @Post()
    createCredential(@Body() credential: CreateCredentialDto, @User() user: UserPrisma) {
        return this.service.createCredential(credential, user)
    }

    @Get()
    getAllCredentials(@User() user: UserPrisma) {
        return this.service.getAllCredentials(user.id)
    }

    @Get(':id')
    async getCredentialById(@Param('id', ParseIntPipe) credentialId: number, @User() user: UserPrisma) {
        return await this.service.getCredentialById(credentialId, user.id);
    }

    @Delete(':id')
    async deleteCredentialById(@Param('id', ParseIntPipe) credentialId: number, @User() user: UserPrisma) {
        return await this.service.deleteCredentialById(credentialId, user.id);
    }
}

