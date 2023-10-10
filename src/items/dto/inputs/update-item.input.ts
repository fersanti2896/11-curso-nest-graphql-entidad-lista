import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType( CreateItemInput ) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID('all')
  id: string;
}
