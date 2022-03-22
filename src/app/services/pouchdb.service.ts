import {EventEmitter, Injectable} from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})

export class PouchdbService {

  private isInstantiated: boolean;
  private listener: EventEmitter<any> = new EventEmitter();
  private db: any;

  public constructor() {
    if (!this.isInstantiated) {
      this.db = new PouchDB('notifications');
      this.isInstantiated = true;
    }
  }

  public fetch() {
    return this.db.allDocs({include_docs: true});
  }

  public get(id: string) {
    return this.db.get(id);
  }

  public put(data) {
    this.db.put(data, (result, error) => {
      console.log(result, error);
    });
  }

  public destroy() {
    this.db.destroy().then((response) => {
      // success
      this.isInstantiated = false;
    }).catch((err) => {
      console.log(err);
    });
  }

  public sync(remote: string) {
    const remoteDatabase = new PouchDB(remote);
    this.db.sync(remoteDatabase, {
      live: true
    }).on('change', change => {
      this.listener.emit(change);
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }

  public getChangeListener() {
    return this.listener;
  }

}
