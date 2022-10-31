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
      authServerUrl: 'http://localhost:8080',
      realm: 'demo',
      clientId: 'demo-api',
      secret: 'jsKOzC1LLfy8UIRIdktiXKLSxI185TKn',
      bearerOnly: true,
      realmPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1S6xZg3nuQoh04LUS+MIiCusPHtQ73/PUwN6k3o2QSXeBn79K0QIQH7LMECcZ2YhS23AXTjX71hLWBzi498JWKKJjJ8ZpoH1M9lJKx3pDfzeqQD66eq6E25lYG65hNDqzCQABvnw7AsVIY8GMPMrc+o+qfrrGigge5krciX+dD0KY9lo1v1otyZB8UT1V9geEGaWepfpuz73Qc2dU95CH/mPMpatjB1s1WJDzJZWPFQtXmLdFCjn5LBWked6CcMsrZ5cbkooLxbT+Ur0RvYAeDxwxlTX3oqm63uxZgXgk/WiT6i9IWZKniQ7TrXw9ijiblqKm/Ha3kCjx0ApjxCxpQIDAQAB",
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
