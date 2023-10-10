import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies';

@Module({
  providers: [ 
    AuthResolver, 
    AuthService,
    JwtStrategy
  ],
  imports: [ 
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        }
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule
  ],
  exports: [ JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
