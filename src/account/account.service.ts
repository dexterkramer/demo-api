import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'neo4j-driver';
import { EncryptionService } from 'src/encryption/encryption.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Account } from './model/account.model';


@Injectable()
export class AccountService {

    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly neo4jService: Neo4jService
    ) {}

    private hydrate(res): Account {
        if ( !res.records.length ) {
            return undefined
        }

        const user = res.records[0].get('a')

        return new Account(
            user
        )
    }

    private hydrates(res): Account[] {
        if ( !res.records.length ) {
            return undefined
        }

        return res.records.map((rec) => {
            return new Account(rec.get('a'));
        })
    }

    async findAll(args: any): Promise<Account[] | undefined> {
        const res = await this.neo4jService.read(`
            MATCH (a:Account)
            RETURN a
        `);
        return this.hydrates(res)
    }

    async findByEmail(email: string): Promise<Account | undefined> {
        const res = await this.neo4jService.read(`
            MATCH (a:Account {email: $email})
            RETURN a
        `, { email })

        return this.hydrate(res)
    }

    async create(databaseOrTransaction: string | Transaction, email: string, password: string, firstname?: string, lastname?: string): Promise<Account> {

        const res = await this.neo4jService.write(`
            CREATE (a:Account)
            SET a += $properties, a.id = randomUUID()
            RETURN a
        `, {
            properties: {
                email,
                password: await this.encryptionService.hash(password),
                firstname,
                lastname,
            }
        }, databaseOrTransaction)

        return this.hydrate(res)


    }
}