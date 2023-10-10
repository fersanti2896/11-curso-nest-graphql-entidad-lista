import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SingUpInput {
    @Field( () => String )
    @IsEmail()
    email: string;

    @Field( () => String )
    @IsNotEmpty()
    fullName: string;

    @Field( () => String )
    @MinLength(7)
    password: string;
}