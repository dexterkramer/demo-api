import { NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from 'neo4j-driver';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/model/account.model';
import { AuthService } from 'src/auth/auth.service';
import { Neo4jGqlTransactionInterceptor } from 'src/neo4j/neo4j-gql-transaction.interceptor';
// import { GqlLocalAuthGuard } from '../gql-local-auth.guards';
import { LoginUserInput } from '../inputType/login-user.input';
import { LoginResponseType } from '../objectType/login-response.type';


// const pubSub = new PubSub();

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService
  ) {}

//   @Query(returns => Account)
//   async account(@Args('email') email: string): Promise<Account> {
//     const account = await this.accountService.findByEmail(email);
//     if (!account) {
//       throw new NotFoundException(email);
//     }
//     return account;
//   }

//   @Query(returns => [Account])
//   async accounts(@Args() args: AccountsArgs): Promise<Account[]> {
//     const accounts = await this.accountService.findAll(args);
//     return accounts;
//   }

//   @UseInterceptors(Neo4jGqlTransactionInterceptor)
//   @Mutation(returns => CreateAccountType)
//   async createAccount(
//     @Args('newAccount') newAccount: CreateAccountInput,
//     @GQLTransaction() transaction: Transaction
//   ): Promise<CreateAccountType> {

//     const account = await this.accountService.create(
//         transaction,
//         newAccount.email,
//         newAccount.password,
//         newAccount.firstname,
//         newAccount.lastname
//     )

//     const { access_token } = await this.authService.createToken(account);

//     return {
//       account : account,
//       access_token : access_token
//     };
//   }

    // @UseGuards(GqlLocalAuthGuard)
    // @UseInterceptors(Neo4jGqlTransactionInterceptor)
    // @Mutation(returns => LoginResponseType)
    // async login(
    //     @Args('loginUserInput') loginUserInput: LoginUserInput
    // ): Promise<LoginResponseType> {
    //     return this.authService.login(loginUserInput.email);
    // }
}