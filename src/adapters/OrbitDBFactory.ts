import * as OrbitDB from "orbit-db";
import { Store } from "orbit-db-store";

import DatabaseFactory from "../model/DatabaseFactory";
import OrbitDBDatabaseTypes from "./OrbitDBDatabaseTypes";

export default class OrbitDBFactory implements DatabaseFactory {
  private name: string;
  private type: string;
  private options: any;
  private dbInstance: OrbitDB;

  public constructor(dbInstance: OrbitDB, name: string) {
    this.name = name;
    this.dbInstance = dbInstance;
    this.type = 'eventlog';
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  // Set type of database to create (default: 'eventlog')
  public setType(type: string) {
    const types = ['eventlog', 'keyvalue'];
    if (types.includes(type)) {
      this.type = type;
    }
    return this;
  }

  // Currently supports:
  //   isPublic: <boolean>
  //     Set if everyone has write access (default: false)
  //   type: <string>
  //     Set type of database to create   (default: 'eventlog')
  public addOptions(options: any) {
    const accessControl = options.isPublic ? {
      accessController: { 
        type: 'orbitdb',
        write: ['*'] 
      }
    } : {
      accessController: {
        type: 'orbitdb',
        write: [OrbitDB.identity.id]
      }
    };

    if (options.type) {
      this.setType(options.type);
    }

    this.options = {
      ...accessControl,
    };
    return this;
  }

  public create(): Promise<Store> {
    return this.dbInstance.create(this.name, OrbitDBDatabaseTypes.EventStore, this.options);
  }
}
