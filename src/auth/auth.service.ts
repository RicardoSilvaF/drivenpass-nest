import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    private EXPIRATION_TIME = '7 days';

    async signUp(body: SignUpDto) {
        return await this.userService.signUp(body);
    }

    async signIn(body: SignUpDto) {
        const { email, password } = body;
        const user = await this.userService.getByEmail(email);
        if (!user) throw new UnauthorizedException("Email or password not valid.");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Email or password not valid.");

        return this.createToken(user);
    }

    createToken(user: User) {
        const { email } = user;

        const token = this.jwtService.sign({ email }, {
            expiresIn: this.EXPIRATION_TIME,
        })

        return { token };
    }

    checkToken(token: string) {
        const data = this.jwtService.verify(token, {});

        return data;
    }

}
