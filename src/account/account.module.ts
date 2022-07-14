import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { AccountService } from './account.service';
import { AccountResolver } from './resolver/account.resolver';

@Module({
  imports: [
    EncryptionModule,
    forwardRef(() => AuthModule),
  ],
  providers: [AccountService, AccountResolver], 
  exports: [AccountService, AccountResolver],
})
export class AccountModule {}
