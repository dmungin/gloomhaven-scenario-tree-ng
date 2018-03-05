import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class AssetService {

  constructor(private http: Http) { }
  public getScenariosJSON(): Observable<any> {
    return this.http.get('./assets/scenarios.json')
      .map(response => response.json());
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`; 
  }

}
