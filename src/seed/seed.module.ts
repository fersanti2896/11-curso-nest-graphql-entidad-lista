import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from '../items/items.module';
import { Module } from '@nestjs/common';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    SeedResolver, 
    SeedService
  ],
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule
  ]
})
export class SeedModule {}
