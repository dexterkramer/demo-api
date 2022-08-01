import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class LoginUserInput {

  @Field(type => String)
  @IsNotEmpty()
  email: string;

  @Field(type => String, { nullable: false })
  @IsNotEmpty()
  password: string;
}