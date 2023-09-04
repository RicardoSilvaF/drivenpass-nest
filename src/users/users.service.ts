import {  HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository) { };

    async signUp(User: UserDto) {
        const userExists = await this.repository.getUserByEmail(User.email)
        if (userExists) {
            throw new HttpException('Conflict', HttpStatus.CONFLICT)
        }
        return await this.repository.signUp(User);
    }

    async getByEmail(email: string) {
        return await this.repository.getUserByEmail(email);
    }
    
    async getById(id: number){
        return await this.repository.getById(id);
    }
}
