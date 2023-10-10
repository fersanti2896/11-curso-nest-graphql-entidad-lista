import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
    superUser = 'superUser',
    admin = 'admin',
    user = 'user'
}

registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Roles permitidos.' } )