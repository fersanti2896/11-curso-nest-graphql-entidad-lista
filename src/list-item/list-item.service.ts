import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository<ListItem>
  ) {}

  async create( createListItemInput: CreateListItemInput ): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });

    await this.listItemsRepository.save( newListItem )

    return this.findOne( newListItem.id )
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
                                                 .innerJoin('listItem.item', 'item')
                                                 .take( limit )
                                                 .skip( offset )
                                                 .where('"listId" = :listId', { listId: list.id });
                                      
    if( search ) {
      queryBuilder.andWhere('LOWER(item.name) like :name', { name: `%${ search.toLowerCase() }%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if( !listItem ) throw new NotFoundException(`El List Item con el id: ${ id } no existe.`);

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...resto } = updateListItemInput;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
                                                 .update()
                                                 .set( resto )
                                                 .where('id = :id', { id });
                                            
    if( listId ) queryBuilder.set({ list: { id: listId } });
    if( itemId ) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne( id );
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async listItemCountByList( list: List ): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: { id: list.id }
      }
    })
  }
}
