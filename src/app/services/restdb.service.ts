import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';



@Injectable({
  providedIn: 'root'
})
export class RestDbService {

  public votes = {
    get: (): Observable<any> => this.http.get(this.baseUrl + '/votes-votes', this.headers),
    save: (vote): Observable<any> => this.http.post(this.baseUrl + '/votes-votes', JSON.stringify(vote), this.headers)
  };

  // public users = {
  //   get: (): Observable<any> => this.http.get(this.baseUrl + '/votes-users, this.headers'),
  // };

  public users = {
    get: () => this.pUsers
  };

  private baseUrl = 'https://votes-df67.restdb.io/rest';
  private apiKey = '88711c91937266487940dca21173e243a2f48';
  private corsApiKey = '61c47c9110ddf150bd78de8f';
  private headers = {
    headers: new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('x-apikey', this.corsApiKey)
  };

  private pUsers: User[] = [];

  constructor(private http: HttpClient){
    this.pUsers.push({name: 'Opa', secret: '47q81'});
    this.pUsers.push({name: 'Oma', secret: '2myp6'});
    this.pUsers.push({name: 'Hugo', secret: 'da767'});
    this.pUsers.push({name: 'Moniek', secret: 'nh94g'});
    this.pUsers.push({name: 'Ine', secret: '76vxr'});
    this.pUsers.push({name: 'Marc', secret: 'x458p'});
    this.pUsers.push({name: 'Fil', secret: '69ci4'});
    this.pUsers.push({name: 'Pol', secret: 'c72sy'});
    this.pUsers.push({name: 'Jul', secret: '8fb39'});
    this.pUsers.push({name: 'Laure-Lies', secret: 'lq35z'});
    this.pUsers.push({name: 'Katleen', secret: 'q4e1w'});
    this.pUsers.push({name: 'Erik', secret: 'p8u29'});
    this.pUsers.push({name: 'Bert', secret: 'y21vp'});
    this.pUsers.push({name: 'Nel', secret: '4ng7u'});
  }

}
