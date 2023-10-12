import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { List } from '../lists/entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { ListsService } from '../lists/lists.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository( Item )
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository( User )
        private readonly usersRepository: Repository<User>,

        @InjectRepository( ListItem )
        private readonly listsItemsRepository: Repository<ListItem>,

        @InjectRepository( List )
        private readonly listsRepository: Repository<List>,

        private readonly usersService: UsersService,

        private readonly itemsService: ItemsService,

        private readonly listsService: ListsService,

        private readonly listsItemsService: ListItemService
    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed() {
        if( this.isProd ) {
            throw new UnauthorizedException('No se puede ejecutar el SEED en producción.');
        }

        /* Limpiando la base de datos - Borrar todo */
        await this.deleteDatabase();

        /* Crear usuarios */
        const user = await this.loadUsers();

        /* Crear items */
        await this.loadItems( user );

        /* Crear List */
        await this.loadLists( user );

        /* Crear ListItems */
        const items = await this.itemsService.findAll( user, { limit: 15, offset: 0 }, {} );
        const list = await this.loadLists( user );

        await this.loadListsItems( list, items );

        return true;
    }

    async deleteDatabase() {
        /* Se borra los ListItems */
        await this.listsItemsRepository.createQueryBuilder().delete().where({}).execute();

        /* Se borra los List */
        await this.listsRepository.createQueryBuilder().delete().where({}).execute();

        /* Se borra items */
        await this.itemsRepository.createQueryBuilder().delete().where({}).execute();

        /* Se borra usuarios */
        await this.usersRepository.createQueryBuilder().delete().where({}).execute();
    }

    async loadUsers(): Promise<User> {
        const users = [];

        for (const user of SEED_USERS) {
            users.push( await this.usersService.create(user) )
        }

        return users[0];
    }

    async loadItems( user: User ): Promise<void> {
        const itemsPromises = [];

        for (const item of SEED_ITEMS) {
            itemsPromises.push( await this.itemsService.create( item, user ) );
        }

        await Promise.all( itemsPromises );
    }

    async loadLists( user: User ): Promise<List> {
        const lists = [];

        for (const list of SEED_LISTS ) {
            lists.push( await this.listsService.create( list, user ) );
        }

        return lists[0];
    }

    async loadListsItems( list: List, items: Item[] ) {
        for (const item of items) {
            this.listsItemsService.create({
                quantity: Math.round( Math.random() * 11 ),
                completed: Math.round( Math.random() * 1 ) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            });
        }
    }
}
