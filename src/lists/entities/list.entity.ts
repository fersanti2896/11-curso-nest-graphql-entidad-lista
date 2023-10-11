import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'list' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  @ManyToOne( () => User, (user) => user.lists, { nullable: false, lazy: true } )
  @Index('userId-list-index')
  @Field( () => User )
  user: User;
}
