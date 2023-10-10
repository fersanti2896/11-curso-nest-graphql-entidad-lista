import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsNotEmpty, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field( () => String )
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Field( () => Float )
  // @IsPositive()
  // @Min(1)
  // quantity: number;

  @Field( () => String, { nullable: true } )
  @IsOptional()
  @IsString()
  quantityUnits?: string;
}
