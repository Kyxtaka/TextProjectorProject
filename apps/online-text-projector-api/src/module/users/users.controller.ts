import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UsersController {

    @Get()
    getHello(): string {
        return 'Hello World!';
    }

    @Get(':id')
    getUserById(id: number): string {
        return `User with id ${id}`;
    }
}
