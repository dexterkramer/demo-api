import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/account/model/account.model';

@ObjectType({ description: 'Account' })
export class LoginResponseType {

    @Field(type => Account)
    account: Account;
  
    @Field(type => String)
    access_token: string;

}