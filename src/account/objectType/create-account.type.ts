import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from "../model/account.model";

@ObjectType({ description: 'Account' })
export class CreateAccountType {

    @Field(type => Account)
    account: Account;
  
    // @Field(type => String)
    // access_token: string;

}