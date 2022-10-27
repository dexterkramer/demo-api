import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { upperDirectiveTransformer } from './graphql/directives/upper-case.directive';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { KeycloakConnectModule, PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    AuthModule,
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService, ],
      useFactory: (configService: ConfigService) : Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOSTNAME'),
        port: configService.get('NEO4J_BOLT_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE'),
      })
    }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://keycloak:8080',
      realm: 'demo',
      clientId: 'demo-api',
      secret: 'jsKOzC1LLfy8UIRIdktiXKLSxI185TKn',
      bearerOnly: true,
      // realmPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzbbyfC3od0wAXK7/cCHLlozUBxZ/s93ZaHO2bzgix545E6XISBP/V4TK0z5a5ywHRaHa0n8W9fa0px63Lc8rPt/3JrjJAOd1uE0m8jmvuKPyQuOrJwlVkNvUySNSERtcEEC4Z2daMtJTUtgh3LaE34pAMBtAvCNJuFBQBWWrCkc3BF6VENzLbSMeRzmqdGqSYTpVxcPly5u4u6P+9+1bLT/sqDz6/SjR4Bshh2lhbuWqu1IrehRBhqtRzZkkRxIK6+4C6zazJPw9GAfFOoWWw7ReLbxPQ478rL8MiL3wV4kUxsvmytL4knygC3iRgTSz9VjIXMmdttey0qskOLs24wIDAQAB",
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE, // optional
      tokenValidation: TokenValidation.ONLINE, // optional
      // logLevels: ['verbose'],
      // useNestLogger: false,
    })
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
