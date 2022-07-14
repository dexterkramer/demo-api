import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/model/account.model';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService
    ) {}

  async validateUser(email: string, password: string) {
    const account = await this.accountService.findByEmail(email);

    if ( account !== undefined && await this.encryptionService.compare(password, account.password) ) {
        return account;
    }

    return null;
  }

  async login(account: any) {
    const payload = { username: account.username, sub: account.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createToken(account: Account) {
    // Deconstruct the properties
    const { id, email, firstName, lastName } =  account.toJson()

    // Encode that into a JWT
    return {
        access_token: this.jwtService.sign({
            sub: id,
            email, firstName, lastName,
        }),
    }
  }
}