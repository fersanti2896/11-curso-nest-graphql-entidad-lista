import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
    @Field( () => String )
    @IsEmail()
    email: string;

    @Field( () => String )
    @MinLength(7)
    password: string;
}