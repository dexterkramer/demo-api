import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AccountService } from "src/account/account.service";
import { Account } from "src/account/model/account.model";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly accountServivce: AccountService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: any): Promise<Account> {
        const account = await this.accountServivce.findByEmail(payload.email)

        if ( !account ) {
            throw new UnauthorizedException()
        }

        return account;
    }

}