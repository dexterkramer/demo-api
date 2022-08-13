import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/model/account.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService
    ) {}

  async validateUser(email: string, password: string) {
    // const account = await this.accountService.findByEmail(email);
    // if ( account !== undefined && await this.encryptionService.compare(password, account.password) ) {
    //     return account;
    // }

    // return null;
  }

  async login(email: string) {

  }

  async createToken(account: Account) {

  }
}