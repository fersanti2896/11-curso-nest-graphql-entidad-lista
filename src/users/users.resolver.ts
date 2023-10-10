import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { CurrentUser } from '../auth/decorators/current-user.decorators';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService  
  ) {}

  @Query( () => [ User ], { name: 'users' } )
  findAll( 
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User 
  ): Promise<User[]> {
    return this.usersService.findAll( validRoles.roles );
  }

  @Query( () => User, { name: 'user' } )
  async findOne( 
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ ValidRoles.admin, ValidRoles.superUser ]) user: User 
  ): Promise<User> {
    return this.usersService.findOneById( id );
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser( 
    @Args('updateUserInput') updateUserInput: UpdateUserInput, 
    @CurrentUser([ ValidRoles.admin ]) user: User 
  ): Promise<User> {
    return this.usersService.update( updateUserInput.id, updateUserInput, user );
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser( 
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ ValidRoles.admin ]) user: User 
  ): Promise<User> {
    return this.usersService.block( id, user );
  }

  @ResolveField( () => Int, { name: 'itemCount' } )
  async itemCount( 
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User 
  ): Promise<number> {
    return this.itemService.itemCountByUer( user );
  }

  @ResolveField( () => [Item], { name: 'items' } )
  async getItemsByUser( 
    @CurrentUser([ ValidRoles.admin ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemService.findAll( user, paginationArgs, searchArgs );
  }
}
