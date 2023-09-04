import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async signIn(userDto: UserDto) {
        const { email, password } = userDto;
    
        const user = await this.repository.getUserByEmail(email);
    
        if (!user) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    
        const isPasswordValid = bcrypt.compareSync(password, user.password);
    
        if (!isPasswordValid) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    
        return user;
    }
    
}
