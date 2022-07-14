import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { EncryptionModule } from './encryption/encryption.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { upperDirectiveTransformer } from './graphql/directives/upper-case.directive';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';

@Module({
  imports: [
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   debug: false,
    //   playground: true,
    //   typePaths: ['./**/*.graphql'],
    //   definitions: {
    //     path: join(process.cwd(), 'src/graphql.ts'),
    //     outputAs: 'class',
    //   },
    // }),
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
    EncryptionModule,
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
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
