import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository( Item )
    private readonly itemsRepository: Repository<Item>
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });

    return await this.itemsRepository.save( newItem );
  }

  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    // TODO: Una forma de búsqueda
    // return this.itemsRepository.find({
    //   take: limit, 
    //   skip: offset,
    //   where: {
    //     user: { id: user.id }, 
    //     name: Like(`%${ search }%`)
    //   }
    // });

    // TODO: Consulta por queryBuilder
    const queryBuilder = this.itemsRepository
                             .createQueryBuilder()
                             .take( limit )
                             .skip( offset )
                             .where(`"userId" = :userId`, { userId: user.id });

    if( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` });
    }
    
    return queryBuilder.getMany();    
  }

  async findOne( id: string, user: User ): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
        id: id,
        user: { id: user.id }
    });

    if( !item ) throw new NotFoundException(`El item con el id: ${ id } no fue encontrado.`);

    // item.user = user;

    return item;
  }

  async update( id: string, updateItemInput: UpdateItemInput, user: User ): Promise<Item> {
    await this.findOne( id, user );
    const item = await this.itemsRepository.preload( updateItemInput );

    if( !item ) throw new NotFoundException(`El item con el id: ${ updateItemInput.id } no fue encontrado.`);
    
    return this.itemsRepository.save( item );
  }

  async remove( id: string, user: User ): Promise<Item> {
    // TODO: Soft delete, intregidad referencial
    const item = await this.findOne(id, user);

    await this.itemsRepository.remove( item );

    return { ...item, id: id };
  }

  async itemCountByUer( user: User ): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: { id: user.id }
      }
    })
  }
}
