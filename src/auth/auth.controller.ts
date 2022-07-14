import { Controller, Post, Body, UseGuards, Request, Get, UseInterceptors, UsePipes, ValidationPipe, Put, Delete, BadRequestException } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { Neo4jTransactionInterceptor } from '../neo4j/neo4j-transaction.interceptor';
import { Transaction } from 'neo4j-driver';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { AccountService } from 'src/account/account.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly accountService: AccountService
    ) { }

    @UseInterceptors(Neo4jTransactionInterceptor)
    @UsePipes(ValidationPipe)
    @Post('register')
    async postRegister(@Body() createAccountDto: CreateAccountDto, @Request() req) {
        const transaction: Transaction = req.transaction

        const account = await this.accountService.create(
            transaction,
            createAccountDto.email,
            createAccountDto.password,
            createAccountDto.firstName,
            createAccountDto.lastName
        )

        const { access_token } = await this.authService.createToken(account)

        return {
            ...account.toJson(),
            access_token
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async postLogin(@Request() request) {
        const account = request.user
        const { access_token } = await this.authService.createToken(request.user)

        return {
            ...account.toJson(),
            access_token
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('account')
    async getAccount(@Request() request) {
        const { access_token } = await this.authService.createToken(request.user)
        return {
            ...request.user.toJson(),
            access_token,
        }
    }
}
