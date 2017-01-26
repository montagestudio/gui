import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class DiskDao extends AbstractDao {

    public constructor() {
        super(Model.Disk);
    }

    public erase(disk: any) {
        return this.middlewareClient.submitTask('disk.erase', [disk.id]);
    }
}


