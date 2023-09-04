import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDto } from "./dto/users.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService){};
    async signUp(body: UserDto) {
        const {email,password} = body
        return await this.prisma.user.create({
            data : {
                email: email,
                password : bcrypt.hashSync(password,10)
            }
        })
    }

    async getUserByEmail(email : string){
        return await this.prisma.user.findFirst({
            where :{
                email
            }
        })
    }

    async getById(id: number) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
}