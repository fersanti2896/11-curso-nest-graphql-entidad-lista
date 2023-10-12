import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from '../items/items.module';
import { Module } from '@nestjs/common';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from '../lists/lists.module';
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
    ListsModule,
    ListItemModule,
    UsersModule
  ]
})
export class SeedModule {}
