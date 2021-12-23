import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../models/user';
import { MockDbService } from './mockdb.service';
import { RestDbService } from './restdb.service';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  public changes: EventEmitter<any> = new EventEmitter();

  public votes = {
    get: () => this.db.votes.get(),
    save: (vote) => {
      const wrongSecret = ((vote.secret !== '') && (vote.secret !== this.pUsers.filter((u) => u.name === vote.name)[0].secret));
      if (wrongSecret) {
        return;
      }
      this.db.votes.get().subscribe((votes) => {
        const found = votes.filter((v) => v.name === vote.name)[0];
        if (found === undefined && found !== null) {
          this.db.votes.save(vote).subscribe(
            (succes) => {
              this.changes.emit('votes');
            },
            (error) => {
              this.changes.emit('posterror');
            }
          );
        }
      });
    }
  };

  public users = {
    get: () => this.pUsers
  };

  private pUsers: User[] = [];

  constructor(private db: RestDbService){
    this.pUsers = this.db.users.get();
    // this.db.users.get().subscribe((users) => {
    //   this.pUsers = users;
    //   this.changes.emit('users');
    // });
  }

}
