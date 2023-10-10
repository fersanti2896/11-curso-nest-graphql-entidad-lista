import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SingUpInput } from './dto/inputs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorators';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver( () => AuthResponse )
export class AuthResolver {
  constructor( private readonly authService: AuthService ) {}

  @Mutation( () => AuthResponse, { name: 'signup' } )
  async signUp( @Args('signupInput') singupInput: SingUpInput ): Promise<AuthResponse> {
    return this.authService.signup( singupInput );
  }

  @Mutation( () => AuthResponse, { name: 'login' } )
  async login( @Args('loginInput') loginInput: LoginInput ): Promise<AuthResponse> {
    return this.authService.login( loginInput )
  }

  @Query( () => AuthResponse, { name: 'revalidate' } )
  @UseGuards( JwtAuthGuard )
  revalidateToken( @CurrentUser( /* [ ValidRoles.admin ] */) user: User ): AuthResponse {
    return this.authService.revalidateToken( user );
  }
}
