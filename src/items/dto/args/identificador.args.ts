import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty } from 'class-validator';

@ArgsType()
export class IdentificadorArgs {
    @Field( () => ID, { description: 'Identificador del item.' } )
    @IsNotEmpty()
    @IsUUID('all')
    id!: string;
}