import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local";
import { Account } from "src/account/model/account.model";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<Account> {
        console.log(email, password);
        const account = await this.authService.validateUser(email, password)

        if ( !account ) {
            throw new UnauthorizedException()
        }

        return account
    }

}