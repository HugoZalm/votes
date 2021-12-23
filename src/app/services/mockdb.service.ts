import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Vote } from '../models/vote';



@Injectable({
  providedIn: 'root'
})
export class MockDbService {

  public votes = {
    get: (): Observable<any> => of(this.pVotes),
    save: (vote): Observable<any> => of(this.pVotes.push(vote))
  };

  public users = {
    get: () => this.pUsers
  };

  private pUsers: User[] = [];
  private pVotes: Vote[] = [];

  constructor(){
    this.pUsers.push({name: 'Opa', secret: 'Opa'});
    this.pUsers.push({name: 'Oma', secret: 'Oma'});
    this.pUsers.push({name: 'Hugo', secret: 'Hugo'});
    this.pUsers.push({name: 'Moniek', secret: 'Moniek'});
    this.pUsers.push({name: 'Ine', secret: 'Ine'});
    this.pUsers.push({name: 'Marc', secret: 'Marc'});
    this.pUsers.push({name: 'Fil', secret: 'Fil'});
    this.pUsers.push({name: 'Pol', secret: 'Pol'});
    this.pUsers.push({name: 'Jul', secret: 'Jul'});
    this.pUsers.push({name: 'Laure-Lies', secret: 'Laure'});
    this.pUsers.push({name: 'Katleen', secret: 'Katleen'});
    this.pUsers.push({name: 'Erik', secret: 'Erik'});
    this.pUsers.push({name: 'Bert', secret: 'Bert'});
    this.pUsers.push({name: 'Nel', secret: 'Nel'});
  }

}
