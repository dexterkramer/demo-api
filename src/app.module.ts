import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { Neo4jModule } from 'nest-neo4j';
import { NeogqlModule } from './neogql/neogql.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { NeogqlResolver } from './neogql/neogql.resolver';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    // ConfigModule.forRoot({isGlobal: true}),
    // Neo4jModule.forRoot({
    //   scheme: 'bolt',
    //   host: 'neo4j',
    //   port: 7687,
    //   username: 'neo4j',
    //   password: 'connect'
    // }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    NeogqlModule
  ],
  controllers: [AppController],
  providers: [AppService, NeogqlResolver],
})
export class AppModule {}
