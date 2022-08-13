import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './resolver/auth-resolver';

@Module({
  imports: [ 
    AccountModule
  ],
  providers: [
    AuthService,
    AuthResolver
  ],
  exports: [
    AuthService,
    AuthResolver
  ],
  controllers: [AuthController]
})
export class AuthModule {}
