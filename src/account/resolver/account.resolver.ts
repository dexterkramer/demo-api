import { NotFoundException, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from 'neo4j-driver';
import { AuthService } from 'src/auth/auth.service';
import { Neo4jGqlTransactionInterceptor } from 'src/neo4j/neo4j-gql-transaction.interceptor';
import { AccountService } from '../account.service';
import { AccountsArgs } from '../inputType/accounts.args';
import { CreateAccountInput } from '../inputType/create-account.input';
import { Account } from '../model/account.model';
import { CreateAccountType } from '../objectType/create-account.type';
import { GQLTransaction } from '../param-decorator/transaction.decorator';
// import { PubSub } from 'graphql-subscriptions';

// const pubSub = new PubSub();

@Resolver(of => Account)
export class AccountResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService
  ) {}

  @Query(returns => Account)
  async account(@Args('email') email: string): Promise<Account> {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new NotFoundException(email);
    }
    return account;
  }

  @Query(returns => [Account])
  async accounts(@Args() args: AccountsArgs): Promise<Account[]> {
    const accounts = await this.accountService.findAll(args);
    return accounts;
  }

  @UseInterceptors(Neo4jGqlTransactionInterceptor)
  @Mutation(returns => CreateAccountType)
  async createAccount(
    @Args('newAccount') newAccount: CreateAccountInput,
    @GQLTransaction() transaction: Transaction
  ): Promise<CreateAccountType> {

    const account = await this.accountService.create(
        transaction,
        newAccount.email,
        newAccount.password,
        newAccount.firstname,
        newAccount.lastname
    )

    // const { access_token } = await this.authService.createToken(account);

    return {
      account : account,
      // access_token : access_token
    };
  }

//   @Mutation(returns => Recipe)
//   async addRecipe(
//     @Args('newRecipeData') newRecipeData: NewRecipeInput,
//   ): Promise<Recipe> {
//     const recipe = await this.recipesService.create(newRecipeData);
//     // pubSub.publish('recipeAdded', { recipeAdded: recipe });
//     return recipe;
//   }

//   @Mutation(returns => Boolean)
//   async removeRecipe(@Args('id') id: string) {
//     return this.recipesService.remove(id);
//   }

//   @Subscription(returns => Recipe)
//   recipeAdded() {
//     return pubSub.asyncIterator('recipeAdded');
//   }
}