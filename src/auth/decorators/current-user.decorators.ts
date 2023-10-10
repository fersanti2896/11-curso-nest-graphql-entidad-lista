import { createParamDecorator, ExecutionContext, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {
        const ctx = GqlExecutionContext.create( context );
        const user: User = ctx.getContext().req.user;

        if( !user ) {
            throw new InternalServerErrorException('No usuario no viene en la request.');
        }

        if( roles.length === 0 ) return user;

        for (const rol of user.roles) {
            // TODO: Eliminar Valid Roles
            if( roles.includes( rol as ValidRoles ) ) {
                return user;
            }
        }
        
        throw new ForbiddenException(
            `El usuario no tiene permisos. Roles permitidos: ${ roles.join(', ') }`
        )
    }
)