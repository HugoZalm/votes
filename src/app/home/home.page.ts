/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResultParams } from '../models/result-params';
import { User } from '../models/user';
import { Vote } from '../models/vote';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public users: User[] = [];
  public votes: Vote[] = [];
  public form: FormGroup;
  public error = {
    noName: true,
    ownVote: false,
    multipleVotes: false,
    shortVotes: true,
    noSecret: true,
    wrongSecret: false,
    postError: false,
    alreadyPosted: false,
    form: false
  };
  public finished = false;
  public results = [];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      secret: new FormControl(''),
      vote1: new FormControl(''),
      vote2: new FormControl(''),
      vote3: new FormControl('')
    });
    this.data.votes.get().subscribe((votes) => {
      this.votes = votes;
    });
    this.users = this.data.users.get();
    // this.data.changes.subscribe(() => {
    //   this.refreshVotes();
    // });
    this.data.changes.subscribe((type) =>
    {
      if (type === 'votes') {
        this.refreshVotes();
      } else if (type === 'posterror') {
        this.error.postError = true;
      }
    });
    // this.data.changes.subscribe((type) =>
    // {
    //   if (type === 'votes') {
    //     this.refreshVotes();
    //   } else if (type === 'users') {
    //     this.refreshUsers();
    //   }
    // });
  }


  public refreshVotes() {
    this.data.votes.get().subscribe((votes) => {
      this.votes = votes;
      this.checkValues();
      // if (this.votes.length === this.users.length) {
      if (this.votes.length === 3) {
        this.calculateResults();
        this.finished = true;
      }
    });
  }

  // public refreshUsers() {
  //   this.users = this.data.users.get();
  // }

  public save() {
    this.error.postError = false;
    this.data.votes.save({
      name: this.form.controls['name'].value,
      secret: this.form.controls['secret'].value,
      vote1: this.form.controls['vote1'].value,
      vote2: this.form.controls['vote2'].value,
      vote3: this.form.controls['vote3'].value
    });
  }

  public onChange(event) {
    this.checkValues();
  }

  public canVote() {
    return this.error.form;
  }

  public preFillForm(id: string) {
    switch(id) {
      case '1':
        this.preFillForm1();
        break;
      case '2':
        this.preFillForm2();
        break;
      case '3':
        this.preFillForm3();
        break;
    }
  }

  private calculateResults() {
    const resultsMap = new Map<string, ResultParams>();
    this.votes.forEach((v) => {
      let params: ResultParams;
      if (resultsMap.has(v.vote1)) {
        params = new ResultParams(
          resultsMap.get(v.vote1).points + 5,
          resultsMap.get(v.vote1).votes + 1,
          resultsMap.get(v.vote1).votes1 + 1,
          resultsMap.get(v.vote1).votes2,
          resultsMap.get(v.vote1).votes3
        );
        resultsMap.set(v.vote1, params);
      } else {
        params = new ResultParams(5,1,1,0,0);
        resultsMap.set(v.vote1, params);
      }
      if (resultsMap.has(v.vote2)) {
        params = new ResultParams(
          resultsMap.get(v.vote2).points + 3,
          resultsMap.get(v.vote2).votes + 1,
          resultsMap.get(v.vote2).votes1,
          resultsMap.get(v.vote2).votes2 + 1,
          resultsMap.get(v.vote2).votes3
        );
        resultsMap.set(v.vote2, params);
      } else {
        params = new ResultParams(3,1,0,1,0);
        resultsMap.set(v.vote2, params);
      }
      if (resultsMap.has(v.vote3)) {
        params = new ResultParams(
          resultsMap.get(v.vote3).points + 1,
          resultsMap.get(v.vote3).votes + 1,
          resultsMap.get(v.vote3).votes1,
          resultsMap.get(v.vote3).votes2,
          resultsMap.get(v.vote3).votes3 + 1
        );
        resultsMap.set(v.vote3, params);
      } else {
        params = new ResultParams(1,1,0,0,1);
        resultsMap.set(v.vote3, params);
      }
    });
    const res = [];
    for (const [k,v] of resultsMap) {
      res.push({
        name: k,
        points: v.points * 1000 + v.votes * 100 + v.votes1 * 10 + v.votes2 * 5 + v.votes3,
        params: v
      });
    }
    this.results = res.sort((a,b) => (a.points < b.points) ? 1 : -1);
    for (let i = 0; i < this.results.length; i++) {
      if (i !== 0) {
        if (this.results[i].points === this.results[i-1].points) {
          this.results[i].plaats = this.results[i-1].plaats;
        } else {
          this.results[i].plaats = i+1;
        }
      } else {
        this.results[i].plaats = 1;
      }
    }
  }

  private checkValues() {
    const name = this.form.controls['name'].value;
    const secret = this.form.controls['secret'].value;
    const vote1 = this.form.controls['vote1'].value;
    const vote2 = this.form.controls['vote2'].value;
    const vote3 = this.form.controls['vote3'].value;
    const voted = this.votes.filter((v) => v.name === name);
    this.error.noName = name === '';
    this.error.ownVote = (name === vote1) || (name === vote2) || (name === vote3);
    this.error.multipleVotes =
         ((vote1 !== '' && vote2 !== '') && (vote1 === vote2))
      || ((vote2 !== '' && vote3 !== '') && (vote2 === vote3))
      || ((vote1 !== '' && vote3 !== '') && (vote1 === vote3));
    this.error.shortVotes = (vote1 === '') || (vote2 === '') || (vote3 === '');
    this.error.noSecret = secret === '';
    this.error.wrongSecret = ((secret !== '') && (secret !== this.users.filter((u) => u.name === name)[0].secret));
    this.error.postError = false;
    this.error.alreadyPosted = voted.length > 0;
    this.error.form =
         !this.error.noName
      && !this.error.noSecret
      && !this.error.shortVotes
      && !this.error.wrongSecret
      && !this.error.ownVote
      && !this.error.multipleVotes
      && !this.error.alreadyPosted;
  }

  private preFillForm1() {
    this.form.controls["name"].setValue('Opa');
    this.form.controls["secret"].setValue('Opa');
    this.form.controls["vote1"].setValue('Oma');
    this.form.controls["vote2"].setValue('Hugo');
    this.form.controls["vote3"].setValue('Ine');
    this.checkValues();
  }

  private preFillForm2() {
    this.form.controls["name"].setValue('Oma');
    this.form.controls["secret"].setValue('Oma');
    this.form.controls["vote1"].setValue('Katleen');
    this.form.controls["vote2"].setValue('Bert');
    this.form.controls["vote3"].setValue('Nel');
    this.checkValues();
  }

  private preFillForm3() {
    this.form.controls["name"].setValue('Hugo');
    this.form.controls["secret"].setValue('Hugo');
    this.form.controls["vote1"].setValue('Oma');
    this.form.controls["vote2"].setValue('Katleen');
    this.form.controls["vote3"].setValue('Ine');
    this.checkValues();
  }

}
