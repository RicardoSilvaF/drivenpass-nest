import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCredentialDto } from './dto/credentials.dto';
import { User as UserPrisma } from '@prisma/client';

@Injectable()
export class CredentialsRepository {
    constructor(private readonly prisma: PrismaService){}

    async createCredential(credential: CreateCredentialDto, user: UserPrisma){
        return await await this.prisma.credentials.create({
            data: {
              title: credential.title,
              url: credential.url,
              username: credential.username,
              password: credential.password,
              userId: user.id,
            },
          });
    }

    async findCredentialByTitle(title: string, userId: number) {
        return await this.prisma.credentials.findFirst({ where: { title: title, userId: userId } })
    }
    
    async getAllCredentials(userId: number) {
        return await this.prisma.credentials.findMany({
            where: {
                userId: userId,
            },
        });
    }

    async getCredentialById(credentialId: number) {
        return await this.prisma.credentials.findUnique({
            where: {
                id: credentialId
            },
        });
    }
    
    async deleteCredential(credentialId: number): Promise<void> {
        await this.prisma.credentials.delete({
            where: {
                id: credentialId,
            },
        });
    }
}
