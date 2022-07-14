import { Node } from "neo4j-driver";
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Account' })
export class Account {
    constructor(node: Node) {
        this.id = (<Record<string, any>> node.properties).id;
        this.creationDate = (<Record<string, any>> node.properties).creationDate;
        this.email = (<Record<string, any>> node.properties).email;
        this.firstname = (<Record<string, any>> node.properties).firstname;
        this.creationDate = (<Record<string, any>> node.properties).lastname;
    }

    toJson(): Record<string, any> {
        return { 
            id : this.id, 
            email: this.email, 
            firstname : this.firstname, 
            lastname: this.lastname,
            creationDate: this.creationDate
        };
    }

    @Field(type => ID)
    id: string;
  
    @Field({ nullable: true })
    creationDate: Date;
  
    @Field(type => String)
    email: string;
  
    @Field(type => String, { nullable: true })
    firstname?: string;
  
    @Field(type => String, { nullable: true })
    lastname?: string;

    password: string;
  
}