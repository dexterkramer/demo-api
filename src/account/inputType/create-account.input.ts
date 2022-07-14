import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateAccountInput {

  @Field(type => String)
  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @Field(type => String, { nullable: false })
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @Length(1, 255)
  @IsOptional()
  firstname?: string;
  
  @Field({ nullable: true })
  @Length(1, 255)
  @IsOptional()
  lastname?: string;
}