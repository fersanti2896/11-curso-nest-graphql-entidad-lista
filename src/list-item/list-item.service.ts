import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListItemInput, UpdateListItemInput } from './dto';
import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository<ListItem>
  ) {}

  create( createListItemInput: CreateListItemInput ): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });

    return this.listItemsRepository.save( newListItem )
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

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
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
