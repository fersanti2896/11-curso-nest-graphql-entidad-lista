import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { LoginInput, SingUpInput } from './dto/inputs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    private getJwtToken( userId: string ) {
        return this.jwtService.sign({ id: userId });
    }

    /* Creación del usuario */
    async signup( singupInput: SingUpInput ): Promise<AuthResponse> {
        // TODO: Crear Usuario
        const user = await this.usersService.create( singupInput );

        /* Creando el JWT y guardando el id en el JWT */
        const token = this.getJwtToken( user.id );
        
        return { token, user };
    }

    async login( loginInput: LoginInput ): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail( email );

        if( !bcrypt.compareSync( password, user.password ) ) {
            throw new BadRequestException('Credenciales no válidas.');
        }

        /* Creando el JWT y guardando el id en el JWT */
        const token = this.getJwtToken( user.id );

        return { token, user };
    }

    revalidateToken( user: User ): AuthResponse {
        const token = this.getJwtToken( user.id );

        return { token, user };
    }

    async validateUser( id: string ): Promise<User> {
        const user = await this.usersService.findOneById( id );

        if( !user.isActive ) throw new UnauthorizedException(`Usuario está inactivo, hable con el administrador.`);

        delete user.password;

        return user;
    }
}
