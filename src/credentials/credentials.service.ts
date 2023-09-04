import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';
import { CredentialsRepository } from './credentials.repository';
import { CreateCredentialDto } from './dto/credentials.dto';
import { User as UserPrisma } from '@prisma/client';

@Injectable()
export class CredentialsService {
    private readonly cryptr: Cryptr;
    constructor(private readonly repository: CredentialsRepository) {
        const Cryptr = require('cryptr');
        this.cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    }


    async createCredential(credential: CreateCredentialDto, user: UserPrisma) {
        const encryptPassword = this.cryptr.encrypt(credential.password)

        const credentialRepeat = await this.repository.findCredentialByTitle(credential.title, user.id)
        if (credentialRepeat) {
            throw new HttpException('Conflict', HttpStatus.CONFLICT)
        }

        return await this.repository.createCredential({ ...credential, password: encryptPassword }, user);
    }

    async getAllCredentials(userId: number) {
        const credentials = await this.repository.getAllCredentials(userId);

        const decryptedCredentials = credentials.map((credential) => {
            const decryptedPassword = this.cryptr.decrypt(credential.password);
            return { ...credential, password: decryptedPassword };
        });

        return decryptedCredentials;
    }

    async getCredentialById(credentialId: number, userId: number) {
        const credential = await this.repository.getCredentialById(credentialId);
        if (!credential) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)
        }
        if (credential.userId !== userId) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        const decryptedPassword = this.cryptr.decrypt(credential.password);
    
        return { ...credential, password: decryptedPassword };
    }

    async deleteCredentialById(credentialId: number, userId: number) {
        const credential = await this.repository.getCredentialById(credentialId);
        if (!credential) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)
        }
        if (credential.userId !== userId) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        await this.repository.deleteCredential(credentialId);
    }
    
}
