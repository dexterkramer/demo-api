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
import { HttpModule } from '@nestjs/axios';

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
      secret: 'GXpOHX3vwdcdbi885TNrE4b9oAd8Ij4b',
      bearerOnly: true,
      realmPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlTYSiXPsHxoGpQ6Z+dJZ6aoVRtDM52N9A2UU7vbpBWZhjgoIj/WGeq/CMUqUsQWYPs4Vaq5er2vvl/p7eYhivCju6j97BuxH0r4avPjtXM7Uq2J0kpy+LQBUkkBcCc4MkLMExXnh4wl0i96pJw2hxiBdifzNcTKFKnwECiFXb/wKc9Np7O/dFVT95y69lCJu4YGIWKxYSRvS3+1QyqRujOjF+IszGrtPmtRjpKeK5v5Vo8BZtnybeDBzRs7sY8+SplM7hc6WQ8DOFkEXfjd98En2LcRorosShjKVeeDC76jWwZiQLTEKTEwMVstxS7SZ1BigWqCRhGb4C0owEncfpQIDAQAB",
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE, // optional
      tokenValidation: TokenValidation.ONLINE, // optional
      // logLevels: ['verbose'],
      // useNestLogger: false,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
