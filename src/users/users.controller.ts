import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('sign-up')
    signUp(@Body() User: UserDto) {
        return this.usersService.signUp(User);
    }

    @Post('sign-in')
    signIn(@Body() User: UserDto) {
        return this.usersService.signIn(User);
    }
}
